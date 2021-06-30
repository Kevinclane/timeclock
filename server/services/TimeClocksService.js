import { dbContext } from "../db/DbContext";
import { BadRequest } from "../utils/Errors";
import moment from "moment"

//calculates time difference in and returns time in hours.toFixed(2)
function calculateHH(tc) {
  let timeDiff = moment.duration(moment(tc.EndTime).diff(moment(tc.StartTime)))
  let hours = parseFloat(timeDiff.asHours().toFixed(2))
  return hours
}

//caluclates time difference and returns an hour:minute string
function calcualteHHMM(tc) {
  let timeDiff = moment.duration(moment(tc.EndTime).diff(moment(tc.StartTime)))
  let minutes = Math.round(timeDiff.asMinutes())
  let hours = 0
  while (minutes >= 60) {
    minutes -= 60
    hours++
  }
  let hhmm = hours.toString() + ":" + minutes.toString()
  return hhmm
}

//returns true if there have been too many api calls created within time limit
async function checkServerCache(email, type) {
  let serverCache = await dbContext.ServerCache.find({
    CreatorEmail: email,
    Type: type
  })
  let i = 0
  let now = moment()
  let res = false

  while (i < serverCache.length) {
    let expired = moment(serverCache[i].Exp).isSameOrBefore(now)
    if (expired) {
      await dbContext.ServerCache.findByIdAndDelete(serverCache._id)
      serverCache.splice(i, 1)
    } else {
      i++
    }
  }
  if (serverCache.length > 99) {
    res = true
  }
  return res
}

async function createServerCache(email, type) {
  await dbContext.ServerCache.create({
    CreatorEmail: email,
    Type: type,
    Exp: moment().add(1, "hours")
  })
}

class TimeClocksService {
  async getTimeClocks(email, id) {
    let data = await dbContext.TimeClock.find({
      CreatorEmail: email,
      ProjectId: id
    })
    let sortedArr = data.sort((a, b) => a.StartTime - b.StartTime)
    return sortedArr
  }
  async createTimeClock(rawData) {
    let project = await dbContext.Project.findOne({ _id: rawData.ProjectId })
    let abort = moment(rawData.StartTime).isBefore(moment(project.Start))
    if (abort) {
      throw new BadRequest("Cannot create time clock prior to project's start date")
    } else {
      let serverCache = await checkServerCache(rawData.CreatorEmail, "createTC")
      if (serverCache) {
        throw new BadRequest("You have created too many time clocks recently. Please wait a little while before trying again.")
      } else {
        let currentCheck = dbContext.TimeClock.find({
          ProjectId: rawData.ProjectId,
          Current: true
        }).lean()
        if (currentCheck.StartTime) {
          throw new BadRequest("You are already clocked in on this project!")
        } else {
          let data = await dbContext.TimeClock.create(rawData)
          createServerCache(rawData.CreatorEmail, "createTC")
          return data
        }
      }
    }
  }
  async updateTimeClock(rawData, id) {
    let project = await dbContext.Project.findOne({ _id: rawData.ProjectId })
    let abort = moment(rawData.StartTime).isBefore(moment(project.Start))
    if (abort) {
      throw new BadRequest("Cannot create time clock prior to project's start date")
    } else {
      let serverCache = await checkServerCache(rawData.CreatorEmail, "editProject")
      if (serverCache) {
        throw new BadRequest("You have edited too many time clocks recently. Please wait a little while before trying again.")
      } else {
        rawData.TCTotalHours = await calculateHH(rawData)
        rawData.TCTotalHM = await calcualteHHMM(rawData)
        let data = await dbContext.TimeClock.findOneAndUpdate({
          _id: id,
          CreatorEmail: rawData.CreatorEmail
        },
          rawData,
          {
            new: true
          }
        )
        if (!data) {
          throw new BadRequest("Invalid Id")
        } else {
          createServerCache(rawData.CreatorEmail, "editTC")
          return data
        }
      }
    }
  }
  async clockOut(updateInfo) {
    updateInfo.TCTotalHours = await calculateHH(updateInfo)
    updateInfo.TCTotalHM = await calcualteHHMM(updateInfo)

    let data = await dbContext.TimeClock.findOneAndUpdate(
      {
        _id: updateInfo.id,
        CreatorEmail: updateInfo.email
      },
      {
        EndTime: updateInfo.EndTime,
        Current: false,
        Comment: updateInfo.Comment,
        TCTotalHours: updateInfo.TCTotalHours,
        TCTotalHM: updateInfo.TCTotalHM
      },
      {
        new: true
      }
    )
    if (!data) {
      throw new BadRequest("Invalid Id")
    } else return data
  }
  async deleteTimeClock(tcData) {
    let data = await dbContext.TimeClock.findByIdAndDelete({
      _id: tcData.id,
      CreatorEmail: tcData.CreatorEmail
    })
    if (!data) {
      throw new BadRequest("Invalid ID");
    } else return data
  }
  async deleteTimeClocks(email, id) {
    let clocks = await dbContext.TimeClock.find({
      CreatorEmail: email,
      ProjectId: id
    })
    let delCount = 0
    let i = 0
    while (i < clocks.length) {
      let data = await dbContext.TimeClock.findOneAndDelete({
        CreatorEmail: email,
        _id: clocks[i].id
      })
      if (data) {
        delCount++
      }
      i++
    }
    return delCount
  }
  async calculateAllTCTotals(user) {
    let profile = await dbContext.Profile.findOne({ Email: user.email })
    if (!profile.IsAdmin) {
      throw new BadRequest("Unauthorized")
    } else {
      let allTCs = await dbContext.TimeClock.find()
      let i = 0
      while (i < allTCs.length) {
        if (allTCs[i].EndTime) {
          allTCs[i].TCTotalHours = await calculateHH(allTCs[i])
          allTCs[i].TCTotalHM = await calcualteHHMM(allTCs[i])
          await dbContext.TimeClock.findByIdAndUpdate(
            allTCs[i]._id, allTCs[i]
          )
        }
        i++
      }
    }
  }
}

export const timeClocksService = new TimeClocksService()