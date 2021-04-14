import express from "express";
import BaseController from "../utils/BaseController";
import auth0provider from "@bcwdev/auth0provider";
import { subscriptionService } from "../services/SubscriptionService";

export class SubscriptionsController extends BaseController {
  constructor() {
    super("api/subscription");
    this.router
      .use(auth0provider.getAuthorizedUserInfo)
      .post("/ids", this.createIdModel)
      .get("/ids", this.getAllIdModels)
  }
  async createIdModel(req, res, next) {
    try {
      let data = await subscriptionService.createIdModel(req.body.id)
      res.send(data)
    } catch (error) {
      next(error)
    }
  }
  async getAllIdModels(req, res, next) {
    try {
      let ids = await subscriptionService.getAllIdModels();
      res.send(ids);
    } catch (error) {
      next(error);
    }
  }
}
