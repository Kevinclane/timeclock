import { dbContext } from "../db/DbContext";
import { BadRequest } from "../utils/Errors";
import moment from "moment"


//this function takes in an interger or float representing number of hours and returns a string formatted as HH:MM
function caluclateHHMM(input) {
  input = input.toString()
  let Hours = ""
  let Minutes = ""
  if (input.includes(".")) {
    let split = input.split(".")
    Hours = split[0]
    Minutes = "." + split[1] //resets to a decimal of an hour
    Minutes = (Math.round(parseFloat(Minutes) * 60)).toString();
    if (Minutes.length == 1) {
      Minutes = "0" + Minutes
    }
  } else {
    Hours = input
    Minutes = "00"
  }
  let output = Hours + ":" + Minutes
  return output
}

//takes in hours in format nn.nn hours
//returns rounded hours in format nn.nn
function roundFromHoursHH(time, roundTo) {
  time = time.toString();
  let Hours;
  let Minutes;
  if (time.includes(".")) {
    let split = time.split(".");
    Hours = parseInt(split[0]);
    //At this point, Minutes are a decimal of a whole hour
    Minutes = parseFloat("." + split[1])
  } else {
    Hours = parseInt(time);
    Minutes = 0;
  }
  //converts minutes from decimal of an hour into actual minutes
  Minutes = (Minutes * 60).toFixed(2);
  Minutes = Math.round(Minutes / roundTo)
  Minutes = Minutes * roundTo
  if (Minutes >= 60) {
    Minutes = 0
    Hours++
  }
  Hours = Hours.toString();
  Minutes = (Math.round(Minutes / 60)).toString();
  if (Minutes.length == 1) {
    Minutes = Minutes + "0";
  }
  time = parseFloat(Hours + "." + Minutes);
  return time;
}

function roundFromHoursHHMM(time, roundTo) {
  time = time.toString()
  let Hours
  let Minutes
  if (time.includes(".")) {
    let split = time.split(".")
    Hours = parseInt(split[0])
    Minutes = "." + split[1]
    Minutes = (Math.round(parseFloat(Minutes) * 60)).toString()
    if (Minutes.length == 1) {
      Minutes = "0" + Minutes
    }
  } else {
    Hours = parseInt(time)
    Minutes = 0
  }
  Minutes = Math.round(Minutes / roundTo)
  Minutes = Minutes * roundTo
  if (Minutes >= 60) {
    Minutes = 0
    Hours++
  }
  Hours = Hours.toString();
  Minutes = Minutes.toString()
  if (Minutes.length == 1) {
    Minutes = Minutes + "0";
  }
  time = Hours + ":" + Minutes;
  return time;
}

function clearExcessData(projectData) {
  if (projectData.PayPeriod == "Weekly" || projectData.PayPeriod == "Bi-Weekly" || projectData.PayPeriod == "FirstAndFive") {
    projectData.InvoiceDay = ""
  } else if (projectData.PayPeriod == "Monthly") {
    projectData.Start = ""
    projectData.End = ""
  } else if (projectData.PayPeriod == "Milestone") {
    projectData.InvoiceDay = ""
    projectData.Start = ""
    projectData.End = ""
    projectData.PayType = ""
  }
  if (projectData.PayType == "Hourly") {
    projectData.SalaryFrequency = ""
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
    let serverCache = await checkServerCache(projectData.CreatorEmail, "createProject")
    if (serverCache) {
      throw new BadRequest("You have created too many projects recently. Please wait a little while before trying again.")
    } else {
      let projects = await dbContext.Project.find({ CreatorEmail: projectData.CreatorEmail })
      if (profile.Subscription == "Free" && projects.length >= 1) {
        throw new BadRequest("You must be subscribed to create more projects.")
      } else {
        let project = await clearExcessData(projectData)
        project = await dbContext.Project.create(projectData)
        createServerCache(project.CreatorEmail, "createProject")
        return project
      }
    }
  }
  async editProject(projectData) {
    let serverCache = await checkServerCache(projectData.CreatorEmail, "editProject")
    if (serverCache) {
      throw new BadRequest("You have edited too many projects recently. Please wait a little while before trying again.")
    } else {
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
      createServerCache(project.CreatorEmail, "editProject")
      return project
    }
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

  async projectsToNewFormat(user) {
    let profile = await dbContext.Profile.findOne({ Email: user.email })
    if (!profile.IsAdmin) {
      throw new BadRequest("Unauthorized: Only admins may perform this action")
    } else {
      let projects = await dbContext.Project.find().populate("ProjectSettings")
      let i = 0
      while (i < projects.length) {
        if (projects[i].PayPeriod != "Milestone") {
          let project = await this.setPayPeriods(projects[i])
          await dbContext.Project.findByIdAndUpdate(project._id, project, { new: true })
        }
        i++
      }
    }
    return "No Errors"
  }

  async setPayPeriods(project) {
    let PPs = await dbContext.PayPeriod.find({ ProjectId: project._id })
    let i = 0
    while (i < PPs.length) {
      let formattedStart = moment(PPs[i].StartDay).format("MM/DD/YYYY")
      let formattedEnd = moment(PPs[i].EndDay).format("MM/DD/YYYY")
      let ReadableDates = formattedStart + " - " + formattedEnd
      let Weeks = await this.setWeeks(project, PPs[i])
      let PPTotalHours = 0
      let PPTotalBasePay = 0
      let PPRoundedTotalHours = 0
      let PPRoundedTotalBasePay = 0
      let x = 0
      while (x < Weeks.length) {
        PPTotalHours += Weeks[x].WeekTotalHours
        PPTotalBasePay += Weeks[x].WeekTotalBasePay
        if (project.ProjectSettings.RoundTime) {
          PPRoundedTotalHours += Weeks[x].WeekRoundedHours
          PPRoundedTotalBasePay += Weeks[x].WeekRoundedBasePay
        }
        x++
      }
      let PPTotalHHMM = await caluclateHHMM(PPTotalHours)
      if (project.ProjectSettings.RoundTime) {
        PPRoundedTotalHHMM = await caluclateHHMM(PPRoundedTotalHours)
      }
      project.InvoiceGroups.push(newPPObj)
      i++
      await dbContext.PayPeriod.findOneAndUpdate(
        { _id: PPs[i]._id },
        {
          ReadableDates: ReadableDates,
          PPTotalHours: PPTotalHours,
          PPTotalHHMM: PPTotalHHMM,
          PPTotalBasePay: PPTotalBasePay,
          PPRoundedTotalHours: PPRoundedTotalHours,
          PPRoundedTotalHHMM: PPRoundedTotalHHMM,
          PPRoundedTotalBasePay: PPRoundedTotalBasePay,
          Weeks: Weeks
        },
        { new: true }
      )
    }
  }

  async setWeeks(project, PP) {
    let Weeks = []
    let weekStart = moment(PP.StartDay)
    let PPEnd = moment(PP.EndDay)
    //this loop should go until all of the weeks have been created
    while (moment(weekStart).isSameOrBefore(PPEnd)) {
      let weekEnd = moment(weekStart).add(6, "days")
      let Week = await this.generateWeek(weekStart, weekEnd, PPEnd, project)
      Weeks.push(Week)
      weekStart = moment(weekStart).add(7, "days")
    }
    return Weeks
  }

  async generateWeek(weekStart, weekEnd, PPEnd, project) {
    let ReadableDates = moment(weekStart).format("MM/DD/YYYY") + " - " + moment(weekEnd).format("MM/DD/YYYY");
    let Days = await this.setDays(weekStart, weekEnd, PPEnd, project)
    let WeekTotalHours = 0
    let i = 0
    while (i < Days.length) {
      WeekTotalHours += Days[i].DayTotalHours
      i++
    }
    let WeekTotalHHMM = await caluclateHHMM(WeekTotalHours)
    let WeekRoundedBasePay = null

    let WeekRoundedHours = null
    let WeekRoundedHHMM = null
    if (project.ProjectSettings.RoundTime && project.ProjectSettings.RoundFrequency == "Weekly") {
      WeekRoundedHours = await roundFromHoursHH(WeekTotalHours, project.ProjectSettings.RoundTo)
      WeekRoundedHHMM = await roundFromHoursHHMM(WeekTotalHours, project.ProjectSettings.RoundTo)
      WeekRoundedBasePay = WeekRoundedHours * project.Rate
    }
    let WeekTotalBasePay = null
    if (project.PayType == "Hourly") {
      WeekTotalBasePay = WeekTotalHours * project.Rate
    } else if (project.PayType == "Salary") {
      WeekTotalBasePay = Math.floor(WeekTotalHours / 8) * project.Rate
    }

    let Week = {
      ReadableDates: ReadableDates,
      WeekStart: weekStart,
      WeekEnd: weekEnd,
      Days: Days,
      WeekTotalHours: WeekTotalHours,
      WeekTotalHHMM: WeekTotalHHMM,
      WeekRoundedHours: WeekRoundedHours,
      WeekRoundedHHMM: WeekRoundedHHMM,
      WeekTotalBasePay: WeekTotalBasePay,
      WeekRoundedBasePay: WeekRoundedBasePay
    }

    return Week
  }


  //takes in the start and end of a week
  //calls generateDay to create the day object for each day
  //returns a week's worth of days
  async setDays(weekStart, weekEnd, PPEnd, project) {
    let Days = []
    let currentDay = moment(weekStart)
    while (currentDay.isSameOrBefore(moment(weekEnd)) && currentDay.isSameOrBefore(moment(PPEnd))) {
      let Day = await this.generateDay(currentDay, project)
      Days.push(Day)
      currentDay = moment(currentDay).add(1, "days")
    }
    return Days
  }

  //collect timeclocks beloning to this day and group them into an array
  //then calculate hour and pay totals and return Day
  async generateDay(currentDay, project) {
    let allTCs = await dbContext.TimeClock.find({ ProjectId: project._id })
    let i = 0
    let TCs = []
    while (i < allTCs.length) {
      if (moment(currentDay).isSame(allTCs[i].StartTime, "day")) {
        TCs.push(allTCs[i])
      }
      i++
    }
    i = 0
    let DayTotalHours = 0
    while (i < TCs.length) {
      DayTotalHours += TCs[i].TCTotalHours
      i++
    }
    let DayTotalHHMM = await caluclateHHMM(DayTotalHours)
    let DayRoundedHours = null
    let DayRoundedHHMM = null
    if (project.ProjectSettings.RoundTime && project.ProjectSettings.RoundFrequency == "Day") {
      DayRoundedHours = await roundFromHoursHH(DayTotalHours, project.ProjectSettings.RoundTo)
      DayRoundedHHMM = await roundFromHoursHHMM(DayTotalHours, project.ProjectSettings.RoundTo)
    }
    let DayTotalBasePay = null
    if (project.PayType == "Hourly") {
      DayTotalBasePay = DayTotalHours * project.Rate
    }
    let DayRoundedBasePay = null
    if (project.ProjectSettings.RoundTime && project.ProjectSettings.RoundFrequency == "Day") {
      DayRoundedBasePay = DayRoundedHours * project.Rate
    }

    let Day = {
      ReadableDate: moment(currentDay).format("MM/DD/YYYY"),
      Date: currentDay,
      TimeClocks: TCs,
      DayTotalHours: DayTotalHours,
      DayTotalHHMM: DayTotalHHMM,
      DayRoundedHours: DayRoundedHours,
      DayRoundedHHMM: DayRoundedHHMM,
      DayTotalBasePay: DayTotalBasePay,
      DayRoundedBasePay: DayRoundedBasePay
    }
    return Day
  }

}
export const projectsService = new ProjectsService();
