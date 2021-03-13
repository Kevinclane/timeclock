import express from "express";
import BaseController from "../utils/BaseController";
import auth0provider from "@bcwdev/auth0provider";
import { testsService } from "../services/TestService"
import moment from "moment"

export class TestController extends BaseController {
  constructor() {
    super("api/test");
    this.router
      .post("/", this.createDate)
      .get("/all", this.getDates)

  }
  async getDates(req, res, next) {
    try {
      let data = await testsService.getDates(req.userInfo);
      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  }
  async createDate(req, res, next) {
    try {
      let newDate = Date()
      let obj = {
        CreatorEmail: "test",
        //saves to UTC time
        DateDate: newDate,

        //saves local time
        StringDate: newDate,

        //saves to UTC time
        NewDateDate: new Date(),

        //saves to local time
        NewDateString: new Date(),

        //saves to UTC time
        MomentDate: moment(),

        //saves to local time
        MomentString: moment(),

        //saves to UTC time
        MomentConvertDate: moment(newDate),

        //saves to local time
        MomentConvertString: moment(newDate)
      }
      let data = await testsService.createDate(obj)
      res.status(201).send(data);
    } catch (error) {
      next(error);
    }
  }
}
