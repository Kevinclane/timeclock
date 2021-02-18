import express from "express";
import BaseController from "../utils/BaseController";
import auth0Provider from "@bcwdev/auth0provider";
import { timeClocksService } from "../services/TimeClocksService";

export class TimeClocksController extends BaseController {
  constructor() {
    super("api/timeclock");
    this.router
      .use(auth0Provider.getAuthorizedUserInfo)
      .get("/:id", this.getTimeClocks)
      .put("/:id", this.updateTimeClock)
      .post("", this.createTimeClock);
  }
  async getTimeClocks(req, res, next) {
    try {
      req.body.CreatorEmail = req.userInfo.email
      let data = await timeClocksService.getTimeClocks(req.body, req.params.id)
      res.status(200).send(data)
    } catch (error) {
      next(error)
    }
  }
  async updateTimeClock(req, res, next) {
    try {
      req.body.CreatorEmail = req.userInfo.email
      let data = await timeClocksService.updateTimeClock(req.body, req.params.id)
      res.status(200).send(data)
    } catch (error) {
      next(error)
    }
  }
  async createTimeClock(req, res, next) {
    try {
      req.body.CreatorEmail = req.userInfo.email
      let data = await timeClocksService.createTimeClock(req.body)
      res.status(200).send(data)
    } catch (error) {
      next(error)
    }
  }
}
