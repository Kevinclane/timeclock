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
    }).populate("InvoiceGroups");
    return projects;
  }
  async getProjectById(id, email) {
    let project = await dbContext.Project.findOne({
      CreatorEmail: email,
      _id: id
    }).populate("ProjectSettings").populate("InvoiceGroups")
    if (!project) {
      throw new BadRequest("Invalid Id")
    }
    project = await clearExcessData(project)
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

}
export const projectsService = new ProjectsService();
