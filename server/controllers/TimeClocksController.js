import BaseController from "../utils/BaseController";
import auth0provider from "@bcwdev/auth0provider";
import { timeClocksService } from "../services/TimeClocksService";

export class TimeClocksController extends BaseController {
  constructor() {
    super("api/timeclock");
    this.router
      .use(auth0provider.getAuthorizedUserInfo)
      .get("/calculatetotals", this.calculateAllTCTotals)
      .get("/:id", this.getTimeClocks)
      .put("/:id", this.updateTimeClock)
      .put("/out/:id", this.clockOut)
      .post("", this.createTimeClock)
      .delete("/:id", this.deleteTimeClock)
  }
  async getTimeClocks(req, res, next) {
    try {
      let email = req.userInfo.email
      let data = await timeClocksService.getTimeClocks(email, req.params.id)
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
  async clockOut(req, res, next) {
    try {
      let updateInfo = {
        email: req.userInfo.email,
        id: req.params.id,
        EndTime: req.body.EndTime,
        StartTime: req.body.StartTime,
        Comment: req.body.Comment
      }
      let data = await timeClocksService.clockOut(updateInfo)
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
  async deleteTimeClock(req, res, next) {
    try {
      req.body.CreatorEmail = req.userInfo.email
      req.body.id = req.params.id
      let data = await timeClocksService.deleteTimeClock(req.body)
      res.status(200).send(data)
    } catch (error) {
      next(error)
    }
  }
  async calculateAllTCTotals(req, res, next) {
    try {
      let data = await timeClocksService.calculateAllTCTotals(req.userInfo)
      res.send("Update Complete", data)
    } catch (error) {
      next(error)
    }
  }
}
