import express from "express";
import BaseController from "../utils/BaseController";
import auth0provider from "@bcwdev/auth0provider";
import { timeTracksService } from "../services/TimeTracksService";

export class TimeTrackController extends BaseController {
  constructor() {
    super("api/timetrack");
    this.router
      .get("", this.getUserInfo)
      .use(auth0provider.getAuthorizedUserInfo)
      .put("/:id", this.edit);
  }
  async getUserInfo(req, res, next) {
    try {
      let data = await timeTracksService.getUserInfo(req.userInfo);
      res.send(data);
    } catch (error) {
      next(error);
    }
  }
  async edit(req, res, next) {
    try {
      req.body.creatorId = req.user.sub;
      res.send(req.body);
    } catch (error) {
      next(error);
    }
  }
}
