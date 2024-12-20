import express from "express";
import BaseController from "../utils/BaseController";
import auth0provider from "@bcwdev/auth0provider";
import { profilesService } from "../services/ProfilesService";
import { subscriptionsService } from "../services/SubscriptionsService";

export class ProfilesController extends BaseController {
  constructor() {
    super("api/profile");
    this.router
      .use(auth0provider.getAuthorizedUserInfo)
      .get("", this.getUserProfile)
      // .put("/:id", this.edit)
      .put("/profilepic", this.updateProfilePic)
      .put("/updatebusinessinfo", this.updateBusinessInfo)
      .put("/updatecontactinfo", this.updateContactInfo);
  }
  async getUserProfile(req, res, next) {
    try {
      let profile = await profilesService.getProfile(req.userInfo);
      profile = await subscriptionsService.getSubscriptionData(profile)
      if (profile.PPSubData) {
        if (profile.PPSubData.status == "CANCELLED") {
          profile = await subscriptionsService.cancelledCheck(profile)
        }
      }
      res.send(profile);
    } catch (error) {
      next(error);
    }
  }
  // async edit(req, res, next) {
  //   try {
  //     req.body.creatorId = req.user.sub;
  //     res.send(req.body);
  //   } catch (error) {
  //     next(error);
  //   }
  // }
  async updateProfilePic(req, res, next) {
    try {
      let data = await profilesService.updateProfilePic(req.body, req.userInfo)
      res.send(data)
    } catch (error) {
      next(error)
    }
  }
  async updateContactInfo(req, res, next) {
    try {
      let data = await profilesService.updateContactInfo(req.body, req.userInfo)
      res.send(data)
    } catch (error) {
      next(error)
    }
  }
  async updateBusinessInfo(req, res, next) {
    try {
      let data = await profilesService.updateBusinessInfo(req.body, req.userInfo)
      res.send(data)
    } catch (error) {
      next(error)
    }
  }
}
