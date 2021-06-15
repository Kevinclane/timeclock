import { dbContext } from "../db/DbContext";
import { BadRequest } from "../utils/Errors";
import moment from "moment"


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
  if (serverCache.length > 9) {
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

}
export const projectsService = new ProjectsService();
