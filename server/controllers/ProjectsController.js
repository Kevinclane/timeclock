import express from "express";
import BaseController from "../utils/BaseController";
import auth0provider from "@bcwdev/auth0provider";
import { projectsService } from "../services/ProjectsService";
import { timeClocksService } from "../services/TimeClocksService";
import { payPeriodsService } from "../services/PayPeriodsService"
import moment from "moment"

export class ProjectsController extends BaseController {
  constructor() {
    super("api/projects");
    this.router
      .use(auth0provider.getAuthorizedUserInfo)
      .get("/all", this.getProjects)
      .get("/:id", this.getProjectById)
      .post("/", this.createProject)
      .put("/:id", this.editProject)
      .delete("/:id", this.deleteProject)

  }
  async getProjects(req, res, next) {
    try {
      let data = await projectsService.getProjects(req.userInfo);
      let i = 0
      while (i < data.length) {
        data[i].TimeClocks = await timeClocksService.getTimeClocks(req.userInfo.email, data[i]._id)
        i++
      }
      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  }
  async getProjectById(req, res, next) {
    try {
      let data = await projectsService.getProjectById(req.params.id, req.userInfo.email)
      data.TimeClocks = await timeClocksService.getTimeClocks(req.userInfo.email, data._id)
      if (data.PayPeriod != "Milestone") {
        data.InvoiceGroups = await payPeriodsService.getPayPeriods(req.userInfo.email, data)
      }
      res.status(200).send(data)
    } catch (error) {
      next(error)
    }
  }
  async createProject(req, res, next) {
    try {
      req.body.CreatorEmail = req.userInfo.email;
      let project = await projectsService.createProject(req.body)
      if (project.PayPeriod != "Milestone") {
        let data = await payPeriodsService.createFirstPayPeriod(req.userInfo.email, project)
      }
      res.status(201).send(project);
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
      res.status(200).send(project)
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

}
