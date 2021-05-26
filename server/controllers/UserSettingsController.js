import express from "express";
import BaseController from "../utils/BaseController";
import auth0provider from "@bcwdev/auth0provider";
import { userSettingsService } from "../services/UserSettingsService";
import { profilesService } from "../services/ProfilesService"
import { BadRequest } from "../utils/Errors";

export class UserSettingsController extends BaseController {
  constructor() {
    super("api/usersettings");
    this.router
      .use(auth0provider.getAuthorizedUserInfo)
      .put("", this.editSettings)
  }
  async editSettings(req, res, next) {
    try {
      let profile = await profilesService.getProfile(req.userInfo)
      req.body.UserId = profile._id
      let data = await userSettingsService.editSettings(req.body)
      res.send(data)
    } catch (error) {
      next(error)
    }
  }
}
