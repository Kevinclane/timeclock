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
    } else return project
  }
  async createProject(projectData) {
    let project = await dbContext.Project.create(projectData)
    return project
  }
}
export const projectsService = new ProjectsService();
