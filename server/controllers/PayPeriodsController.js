import express from "express";
import BaseController from "../utils/BaseController";
import auth0provider from "@bcwdev/auth0provider";
import { payPeriodsService } from "../services/PayPeriodsService"

export class PayPeriodsController extends BaseController {
  constructor() {
    super("api/payperiods");
    this.router
      .use(auth0provider.getAuthorizedUserInfo)
      .get("/:id", this.getPayPeriods)
  }
  async getPayPeriods(req, res, next) {
    try {
      let email = req.userInfo.email
      let data = await payPeriodsService.getPayPeriods(email, req.params.id)
      res.status(200).send(data)
    } catch (error) {
      next(error)
    }
  }

}
