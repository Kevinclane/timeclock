import express from "express";
import BaseController from "../utils/BaseController";
import auth0provider from "@bcwdev/auth0provider";
import { projectsService } from "../services/ProjectsService";
import { timeClocksService } from "../services/TimeClocksService";

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
      data.TimeClocks = await timeClocksService.getTimeClocks(req.userInfo, data._id)
      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  }
  async createProject(req, res, next) {
    try {
      req.body.CreatorEmail = req.userInfo.email;
      let project = await projectsService.createProject(req.body)
      res.status(201).send(project);
    } catch (error) {
      next(error);
    }
  }
}
