import { dbContext } from "../db/DbContext";
import { BadRequest } from "../utils/Errors";

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
    })
    if (!project) {
      throw new BadRequest("Invalid Id")
    } else project = this.clearExcessData(project)
    return project
  }
  async createProject(projectData) {

    let project = this.clearExcessData(projectData)
    project = await dbContext.Project.create(projectData)
    return project
  }
  async editProject(projectData) {
    let project = this.clearExcessData(projectData)
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
  clearExcessData(projectData) {
    if (projectData.PayPeriod == "Weekly" || projectData.PayPeriod == "Bi-Weekly") {
      projectData.InvoiceDay = ""
    } else if (projectData.PayPeriod == "FirstAndFive") {
      projectData.InvoiceDay = ""
      projectData.Start = ""
      projectData.End = ""
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
}
export const projectsService = new ProjectsService();
