import express from "express";
import BaseController from "../utils/BaseController";
import auth0provider from "@bcwdev/auth0provider";
import { feedbacksService } from "../services/FeedbacksService";
import { profilesService } from "../services/ProfilesService";

export class FeedbacksController extends BaseController {
  constructor() {
    super("api/feedback");
    this.router
      .use(auth0provider.getAuthorizedUserInfo)
      .get("/all", this.getFeedback)
      .get("/:id", this.getFeedbackById)
      .post("", this.createFeedback)
      .put("/:id", this.editFeedback)
  }
  async getFeedback(req, res, next) {
    try {
      let data = await feedbacksService.getFeedback();
      res.send(data);
    } catch (error) {
      next(error);
    }
  }
  async getFeedbackById(req, res, next) {
    try {
      let data = await feedbacksService.getFeedbackById(req.params.id)
      res.status(200).send(data)
    } catch (error) {
      next(error)
    }
  }
  async createFeedback(req, res, next) {
    try {
      req.body.CreatorEmail = req.userInfo.email;
      let profile = await profilesService.getProfile(req.userInfo)
      req.body.UserId = profile._id
      let project = await feedbacksService.createFeedback(req.body)
      res.status(201).send(project);
    } catch (error) {
      next(error);
    }
  }
  async editFeedback(req, res, next) {
    try {
      let feedback = await feedbacksService.editFeedback(req.body, req.params.id)
      res.status(200).send(feedback)
    } catch (error) {
      next(error)
    }
  }
}
