import express from "express";
import BaseController from "../utils/BaseController";
import auth0provider from "@bcwdev/auth0provider";
import { subscriptionsService } from "../services/SubscriptionsService";
import { profilesService } from "../services/ProfilesService";
import { BadRequest } from "../utils/Errors";

export class SubscriptionsController extends BaseController {
  constructor() {
    super("api/subscriptions");
    this.router
      .use(auth0provider.getAuthorizedUserInfo)
      .put("/updatesubscription", this.updateSubscription)
  }
  async updateSubscription(req, res, next) {
    try {
      let profile = await profilesService.getProfile(req.userInfo);
      if (profile.Email != req.body.user.Email) {
        throw new BadRequest("You are not authorized to edit this profile")
      }
      req.body.userId = profile._id
      let data = await subscriptionsService.updateSubscription(req.body)
      res.send(data)
    } catch (error) {
      next(error);
    }
  }

}
