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
    let newSettings = await dbContext.ProjectSettings.create({ CreatorEmail: project.CreatorEmail })
    project.ProjectSettings = newSettings._id
    project = await dbContext.Project.findOneAndUpdate({
      _id: project.id,
      CreatorEmail: project.CreatorEmail
    },
      project,
      {
        new: true
      }
    )
  }
  return project
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
    let projects = await dbContext.Project.find({ CreatorEmail: projectData.CreatorEmail })
    // let subscription = await 
    if (profile.Subscription == "Free" && projects.length >= 1) {
      throw new BadRequest("You must be subscribed to create more projects.")
    } else {
      let project = await clearExcessData(projectData)
      project = await dbContext.Project.create(projectData)
      return project
    }
  }
  async editProject(projectData) {
    let project = await clearExcessData(projectData)
    project = await dbContext.Project.findOneAndUpdate({
      _id: projectData.id,
      CreatorEmail: projectData.CreatorEmail
    },
      projectData,
      {
        new: true
      }
    )
    return project
  }
  async deleteProject(email, id) {
    await dbContext.Project.findOneAndDelete({
      _id: id,
      CreatorEmail: email
    })
  }

}
export const projectsService = new ProjectsService();
