import { dbContext } from "../db/DbContext";
import { BadRequest } from "../utils/Errors";

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
    let data = await dbContext.TimeClock.create(rawData)
    return data
  }
  async updateTimeClock(rawData, id) {
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
    } else return data
  }
  async clockOut(updateInfo) {
    let data = await dbContext.TimeClock.findOneAndUpdate(
      {
        _id: updateInfo.id,
        CreatorEmail: updateInfo.email
      },
      {
        EndTime: updateInfo.EndTime,
        Current: false
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
}

export const timeClocksService = new TimeClocksService()