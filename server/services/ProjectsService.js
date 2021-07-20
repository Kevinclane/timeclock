import { dbContext } from "../db/DbContext";
import { BadRequest } from "../utils/Errors";
import moment from "moment"


// function splitTime(time) {
//   time = time.toString()
//   let Hours
//   let Minutes
//   let hasSplit = false
//   if (time.includes(".")) {
//     hasSplit = true
//     let split = time.split(".")
//     Hours = parseInt(split[0])
//     Minutes = parseFloat("." + split[1])
//   } else {
//     Hours = parseInt(time)
//     Minutes = 0
//   }
//   let res = {
//     time: time,
//     Hours: Hours,
//     Minutes: Minutes,
//     hasSplit: hasSplit
//   }
//   return res
// }

// function caluclateHHMM(time, roundTo) {
//   let timeObj = splitTime(time)
//   if (timeObj.hasSplit) {
//     timeObj.Minutes = (Math.round(timeObj.Minutes * 60)).toString();
//     if (timeObj.Minutes.length == 1) {
//       timeObj.Minutes = "0" + timeObj.Minutes
//     }
//   }
//   if (roundTo) {
//     timeObj.Minutes = Math.round(timeObj.Minutes / roundTo) * roundTo
//     // timeObj.Minutes = timeObj.Minutes * roundTo
//     if (timeObj.Minutes == 60) {
//       timeObj.Minutes = 0
//       timeObj.Hours++
//     }
//     timeObj.Minutes = timeObj.Minutes.toString()
//     if (timeObj.Minutes.length == 1) {
//       timeObj.Minutes = "0" + timeObj.Minutes;
//     }
//   }
//   let output = timeObj.Hours.toString() + ":" + timeObj.Minutes
//   return output
// }

// function roundFromHoursHH(time, roundTo) {
//   let timeObj = splitTime(time)
//   // Minutes = (Minutes * 60).toFixed(2);
//   timeObj.Minutes = Math.round((timeObj.Minutes * 60) / roundTo) * roundTo
//   // timeObj.Minutes = timeObj.Minutes * roundTo
//   if (timeObj.Minutes == 60) {
//     timeObj.Minutes = 0
//     timeObj.Hours++
//   }
//   timeObj.Hours = timeObj.Hours.toString();
//   timeObj.Minutes = (Math.round((timeObj.Minutes / 60) * 100)).toString();
//   if (timeObj.Minutes.length == 1) {
//     timeObj.Minutes = timeObj.Minutes + "0";
//   }
//   time = parseFloat(timeObj.Hours + "." + timeObj.Minutes);
//   return time;
// }

function clearExcessData(projectData) {
  if (projectData.PayPeriod == "Weekly" || projectData.PayPeriod == "Bi-Weekly" || projectData.PayPeriod == "FirstAndFive") {
    projectData.InvoiceDay = ""
  } else if (projectData.PayPeriod == "Monthly") {
    projectData.Start = ""
    projectData.End = ""
  }
  return projectData
}

async function createProjectSettingsIfNeeded(project) {
  if (!project.ProjectSettings) {
    let newSettings = await dbContext.ProjectSettings.create(
      {
        CreatorEmail: project.CreatorEmail
      }
    )
    project.ProjectSettings = newSettings._id
    project = await dbContext.Project.findOneAndUpdate({
      _id: project.id,
      CreatorEmail: project.CreatorEmail
    },
      project,
      {
        new: true
      }
    ).populate("ProjectSettings")
  }
  return project
}

//returns true if there have been too many projects created within time limit
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
  if (serverCache.length > 49) {
    res = true
  }
  return res
}

async function createServerCache(email, type) {
  await dbContext.ServerCache.create({
    CreatorEmail: email,
    Type: type,
    Exp: moment().add(2, "hours")
  })
}

class ProjectsService {
  async getProjects(user) {
    let projects = await dbContext.Project.find({
      CreatorEmail: user.email
    });
    return projects;
  }
  async getProjectById(id, email) {
    let project = await dbContext.Project.findOne({
      CreatorEmail: email,
      _id: id
    }).populate("ProjectSettings")
    if (!project) {
      throw new BadRequest("Invalid Id")
    } else project = await clearExcessData(project)
    project = await createProjectSettingsIfNeeded(project)
    return project
  }
  async createProject(projectData) {
    let profile = await dbContext.Profile.findOne({ Email: projectData.CreatorEmail }).populate("Subscription");
    // let serverCache = await checkServerCache(projectData.CreatorEmail, "createProject")
    // if (serverCache) {
    // throw new BadRequest("You have created too many projects recently. Please wait a little while before trying again.")
    // } else {
    let projectCount = await dbContext.Project.find({ CreatorEmail: projectData.CreatorEmail }).count()
    if (profile.Subscription == "Free" && projectCount >= 1) {
      throw new BadRequest("You must be subscribed to create more projects.")
    } else {
      let project = await clearExcessData(projectData)
      project = await dbContext.Project.create(projectData)

      // createServerCache(project.CreatorEmail, "createProject")
      return project
      // }
    }
  }
  async editProject(projectData) {
    // let serverCache = await checkServerCache(projectData.CreatorEmail, "editProject")
    // if (serverCache) {
    // throw new BadRequest("You have edited too many projects recently. Please wait a little while before trying again.")
    // } else {
    let project = await clearExcessData(projectData)
    project = await dbContext.Project.findOneAndUpdate({
      _id: projectData.id,
      CreatorEmail: projectData.CreatorEmail
    },
      projectData,
      {
        new: true
      }
    ).populate("ProjectSettings")
    // createServerCache(project.CreatorEmail, "editProject")
    return project
    // }
  }
  async deleteProject(email, id) {
    await dbContext.Project.findOneAndDelete({
      _id: id,
      CreatorEmail: email
    })
    await dbContext.ProjectSettings.findOneAndDelete({ ProjectId: id })
    let pps = await dbContext.PayPeriod.find({ ProjectId: id })
    let i = 0
    while (i < pps.length) {
      await dbContext.PayPeriod.findByIdAndDelete(pps[i]._id)
      i++
    }
    let tcs = await dbContext.TimeClock.find({ ProjectId: id })
    i = 0
    while (i < tcs.length) {
      await dbContext.TimeClock.findByIdAndDelete(tcs[i]._id)
      i++
    }
  }

  //this function can probably be reduced later. 
  async updateProjectSettings(settings, id) {
    settings.Completed = true
    settings.ProjectId = id
    let project = await dbContext.Project.findById(id)
    let data = await dbContext.ProjectSettings.findOneAndUpdate(
      { _id: project.ProjectSettings._id },
      settings,
      { new: true }
    )
    return data
  }

  async lockProjects(project, user) {
    let projects = await dbContext.Project.find({ CreatorEmail: user.email })
    let i = 0
    while (i < projects.length) {
      if (projects[i]._id != project._id) {
        projects[i] = await dbContext.Project.findByIdAndUpdate(
          projects[i]._id,
          { Active: false }
        )
      }
      i++
    }
    return projects
  }
  // async projectsToNewFormat(user) {
  //   let profile = await dbContext.Profile.findOne({ Email: user.email })
  //   if (!profile.IsAdmin) {
  //     throw new BadRequest("Unauthorized: Only admins may perform this action")
  //   } else {
  //     let projects = await dbContext.Project.find().populate("ProjectSettings")
  //     let i = 0
  //     while (i < projects.length) {
  //       if (projects[i].PayPeriod != "Milestone") {
  //         let project = await this.setPayPeriods(projects[i])
  //         await dbContext.Project.findByIdAndUpdate(project._id, project, { new: true })
  //       }
  //       i++
  //     }
  //   }
  //   return "No Errors"
  // }
  // async setPayPeriods(project) {
  //   let PPs = await dbContext.PayPeriod.find({ ProjectId: project._id })
  //   let i = 0
  //   let newIGs = []
  //   while (i < PPs.length) {
  //     let formattedStart = moment(PPs[i].StartDay).format("MM/DD/YYYY")
  //     let formattedEnd = moment(PPs[i].EndDay).format("MM/DD/YYYY")
  //     let ReadableDates = formattedStart + " - " + formattedEnd
  //     let Weeks = await this.setWeeks(project, PPs[i])
  //     let PPHours = 0
  //     let PPPay = 0
  //     let x = 0
  //     while (x < Weeks.length) {
  //       PPHours += Weeks[x].WeekHours
  //       PPPay += Weeks[x].WeekPay
  //       x++
  //     }
  //     let PPHHMM = await caluclateHHMM(PPHours)
  //     let newPPObj = await dbContext.PayPeriod.create(
  //       {
  //         ReadableDates: ReadableDates,
  //         PPHours: PPHours,
  //         PPHHMM: PPHHMM,
  //         PPPay: PPPay,
  //         Weeks: Weeks
  //       }
  //     )
  //     newIGs.push(newPPObj._id)
  //     i++
  //   }
  //   project.InvoiceGroups = newIGs
  //   return project
  // }
  // async setWeeks(project, PP) {
  //   let Weeks = []
  //   let weekStart = moment(PP.StartDay)
  //   let PPEnd = moment(PP.EndDay)
  //   //this loop should go until all of the weeks have been created
  //   while (moment(weekStart).isSameOrBefore(PPEnd)) {
  //     let weekEnd = moment(weekStart).add(6, "days")
  //     let Week = await this.generateWeek(weekStart, weekEnd, PPEnd, project)
  //     Weeks.push(Week)
  //     weekStart = moment(weekStart).add(7, "days")
  //   }
  //   return Weeks
  // }
  // async generateWeek(weekStart, weekEnd, PPEnd, project) {
  //   let ReadableDates = moment(weekStart).format("MM/DD/YYYY") + " - " + moment(weekEnd).format("MM/DD/YYYY");
  //   let Days = await this.setDays(weekStart, weekEnd, PPEnd, project)
  //   let WeekHours = 0
  //   let i = 0
  //   while (i < Days.length) {
  //     WeekHours += Days[i].DayHours
  //     i++
  //   }
  //   let WeekHHMM = await caluclateHHMM(WeekHours)

  //   let WeekPay = 0
  //   i = 0
  //   while (i < Days.length) {
  //     WeekPay += Days[i].DayPay
  //     i++
  //   }

  //   let Week = {
  //     ReadableDates: ReadableDates,
  //     WeekStart: weekStart,
  //     WeekEnd: weekEnd,
  //     Days: Days,
  //     WeekHours: WeekHours,
  //     WeekHHMM: WeekHHMM,
  //     WeekPay: WeekPay
  //   }

  //   return Week
  // }
  // async setDays(weekStart, weekEnd, PPEnd, project) {
  //   let Days = []
  //   let currentDay = moment(weekStart)
  //   while (currentDay.isSameOrBefore(moment(weekEnd)) && currentDay.isSameOrBefore(moment(PPEnd))) {
  //     let Day = await this.generateDay(currentDay, project)
  //     Days.push(Day)
  //     currentDay = moment(currentDay).add(1, "days")
  //   }
  //   return Days
  // }
  // async generateDay(currentDay, project) {
  //   let allTCs = await dbContext.TimeClock.find({ ProjectId: project._id })
  //   let i = 0
  //   let TCs = []
  //   while (i < allTCs.length) {
  //     if (moment(currentDay).isSame(allTCs[i].StartTime, "day")) {
  //       TCs.push(allTCs[i])
  //     }
  //     i++
  //   }

  //   i = 0
  //   let DayHours = 0
  //   while (i < TCs.length) {
  //     DayHours += TCs[i].TCTotalHours
  //     i++
  //   }

  //   let DayHHMM

  //   if (project.ProjectSettings.RoundTime) {
  //     DayHours = await roundFromHoursHH(DayHours, project.ProjectSettings.RoundTo)
  //     DayHHMM = await caluclateHHMM(DayHours, project.ProjectSettings.RoundTo)
  //   } else {
  //     DayHHMM = await caluclateHHMM(DayHours)
  //   }

  //   let DayPay = null
  //   if (project.PayType == "Hourly") {
  //     DayPay = DayHours * project.Rate
  //   } else if (project.PayType == "Salary") {
  //     //!NOTE add functionality for Salary
  //   }

  //   let Day = {
  //     ReadableDate: moment(currentDay).format("MM/DD/YYYY"),
  //     Date: currentDay,
  //     TimeClocks: TCs,
  //     DayHours: DayHours,
  //     DayHHMM: DayHHMM,
  //     DayPay: DayPay,
  //   }
  //   return Day
  // }

}
export const projectsService = new ProjectsService();
