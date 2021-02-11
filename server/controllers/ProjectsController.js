import express from "express";
import BaseController from "../utils/BaseController";
import auth0provider from "@bcwdev/auth0provider";
import { projectsService } from "../services/ProjectsService";

export class ProjectsController extends BaseController {
  constructor() {
    super("api/projects");
    this.router
      .use(auth0provider.getAuthorizedUserInfo)
      .get("/all", this.getProjects)
      .post("/", this.createProject);
  }
  async getProjects(req, res, next) {
    try {
      let data = await projectsService.getProjects(req.userInfo);
      res.send(data);
    } catch (error) {
      next(error);
    }
  }
  async createProject(req, res, next) {
    try {
      req.body.creatorEmail = req.userInfo.email;
      let project = await projectsService.createProject(req.body)
      res.status(201).send(project);
    } catch (error) {
      next(error);
    }
  }
}
