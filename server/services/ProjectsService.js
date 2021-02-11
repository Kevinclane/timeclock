import { dbContext } from "../db/DbContext";

/**
 * Adds sub to userData if not already on userData
 * @param {any} userData
 * @param {any} user
 */
async function mergeSubsIfNeeded(userData, user) {
  if (!userData.subs.includes(user.sub)) {
    userData.subs.push(user.sub);
    await userData.save();
  }
}

/**
 * Restricts changes to the body of the profile object
 * @param {any} body
 */
function sanitizeBody(body) {
  let writable = {
    name: body.name,
    phones: body.phones,
    addresses: body.addresses,
    notes: body.notes,
    picture: body.picture
  };
  return writable;
}

class ProjectsService {
  async getProjects(user) {
    let projects = await dbContext.Project.find({
      email: user.email
    });
    return projects;
  }
  async createProject(projectData) {
    let project = await dbContext.Project.create(projectData)
    return project
  }
}
export const projectsService = new ProjectsService();
