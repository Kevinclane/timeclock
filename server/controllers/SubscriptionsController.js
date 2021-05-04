import express from "express";
import BaseController from "../utils/BaseController";
import auth0provider from "@bcwdev/auth0provider";
import { subscriptionsService } from "../services/SubscriptionsService";
import { profilesService } from "../services/ProfilesService";
import { BadRequest } from "../utils/Errors";

export class SubscriptionsController extends BaseController {
  constructor() {
    super("api/subscription");
    this.router
      .use(auth0provider.getAuthorizedUserInfo)
      .post("", this.createIdModel)
      .get("", this.getAllIdModels)
  }
  async createIdModel(req, res, next) {
    try {
      let data = await subscriptionsService.createIdModel(req.body.id)
      res.send(data)
    } catch (error) {
      next(error)
    }
  }
  async getAllIdModels(req, res, next) {
    try {
      let ids = await subscriptionsService.getAllIdModels();
      res.send(ids);
    } catch (error) {
      next(error);
    }
  }
}
