import BaseController from "../utils/BaseController";
import auth0provider from "@bcwdev/auth0provider";
import { projectsService } from "../services/ProjectsService";
import { timeClocksService } from "../services/TimeClocksService";
import { payPeriodsService } from "../services/PayPeriodsService"

export class ProjectsController extends BaseController {
  constructor() {
    super("api/projects");
    this.router
      .use(auth0provider.getAuthorizedUserInfo)
      .get("/all", this.getProjects)
      .get("/newprojectformat", this.projectsToNewFormat)
      .get("/:id", this.getProjectById)
      .put("/:id", this.editProject)
      .put("/invoicegroups/update", this.updateInvoiceGroups)
      .put("/projectsettings/update/:id", this.updateProjectSettings)
      .post("", this.createProject)
      .post("/lockprojects", this.lockProjects)
      .delete("/:id", this.deleteProject)
  }
  async getProjects(req, res, next) {
    try {
      let data = await projectsService.getProjects(req.userInfo);
      res.send(data);
    } catch (error) {
      next(error);
    }
  }
  async getProjectById(req, res, next) {
    try {
      let data = await projectsService.getProjectById(req.params.id, req.userInfo.email)
      res.send(data)
    } catch (error) {
      next(error)
    }
  }
  async createProject(req, res, next) {
    try {
      req.body.CreatorEmail = req.userInfo.email;
      let project = await projectsService.createProject(req.body)
      res.send(project);
    } catch (error) {
      next(error);
    }
  }
  async editProject(req, res, next) {
    try {
      req.body.CreatorEmail = req.userInfo.email
      req.body.id = req.params.id
      req.body.TimeClocks = {}
      let project = await projectsService.editProject(req.body)
      project.TimeClocks = await timeClocksService.getTimeClocks(req.userInfo.email, project._id)
      res.send(project)
    } catch (error) {
      next(error)
    }
  }
  async deleteProject(req, res, next) {
    try {
      let data = await projectsService.deleteProject(req.userInfo.email, req.params.id)
      await timeClocksService.deleteTimeClocks(req.userInfo.email, req.params.id)
      await payPeriodsService.deletePayPeriods(req.userInfo.email, req.params.id)
      res.send(data)
    } catch (error) {
      next(error)
    }
  }
  async updateProjectSettings(req, res, next) {
    try {
      let data = await projectsService.updateProjectSettings(req.body, req.params.id)
      res.send(data)
    } catch (error) {
      next(error)
    }
  }
  async updateInvoiceGroups(req, res, next) {
    try {
      let data = await payPeriodsService.updateInvoiceGroups(req.body)
      res.send(data)
    } catch (error) {
      next(error)
    }
  }
  async lockProjects(req, res, next) {
    try {
      let projects = await projectsService.lockProjects(req.body, req.userInfo)
      res.send(projects)
    } catch (error) {
      next(error)
    }
  }

  async projectsToNewFormat(req, res, next) {
    try {
      await projectsService.projectsToNewFormat(req.userInfo)
      res.send("Updated Successfully")
    } catch (error) {
      next(error)
    }
  }
}
