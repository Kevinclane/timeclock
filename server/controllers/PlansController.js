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
      let plans = await plansService.getAllPlans();
      res.send(plans);
    } catch (error) {
      next(error);
    }
  }
}
