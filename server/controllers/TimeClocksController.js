import express from "express";
import BaseController from "../utils/BaseController";
import auth0provider from "@bcwdev/auth0provider";
import { timeClocksService } from "../services/TimeClocksService";

export class TimeClocksController extends BaseController {
  constructor() {
    super("api/timeclock");
    this.router
      .use(auth0provider.getAuthorizedUserInfo)
      .post("", this.createTimeClock)
      .put("/:id", this.updateTimeClock)
  }
  async createTimeClock(req, res, next) {
    try {
      req.body.CreatorEmail = req.userInfo.email
      let data = await timeClocksService.createTimeClock(req.body)
      res.status(201).send(data)
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
}
