import express from "express";
import BaseController from "../utils/BaseController";
import auth0provider from "@bcwdev/auth0provider";
import { plansService } from "../services/PlansService";
import { profilesService } from "../services/ProfilesService";
import { BadRequest } from "../utils/Errors";

export class PlansController extends BaseController {
  constructor() {
    super("api/plans");
    this.router
      .use(auth0provider.getAuthorizedUserInfo)
      .post("", this.insertPlan)
      .get("", this.getAllPlans)
      .get("/planstatuses", this.getPlanStatuses)
      .put("/planstatuses", this.addPlanStatus)
      .put("/planstatuses/remove", this.removePlanStatus)
  }
  async insertPlan(req, res, next) {
    try {
      let data = await plansService.insertPlan(req.body)
      res.send(data)
    } catch (error) {
      next(error)
    }
  }
  async getAllPlans(req, res, next) {
    try {
      let plans = await plansService.getAllPlans(req.userInfo);
      res.send(plans);
    } catch (error) {
      next(error);
    }
  }
  async addPlanStatus(req, res, next) {
    try {
      let statuses = await plansService.addPlanStatus(req.body, req.userInfo)
      res.send(statuses)
    } catch (error) {
      next(error)
    }
  }
  async getPlanStatuses(req, res, next) {
    try {
      let statuses = await plansService.getPlanStatuses(req.userInfo);
      res.send(statuses)
    } catch (error) {
      next(error)
    }
  }
  async removePlanStatus(req, res, next) {
    try {
      let statuses = await plansService.removePlanStatus(req.body, req.userInfo)
      res.send(statuses)
    } catch (error) {
      next(error)
    }
  }
}
