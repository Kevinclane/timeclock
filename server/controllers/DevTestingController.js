import { devtestingService } from "../services/DevTestingService"
import BaseController from "../utils/BaseController";

export class DevTestingController extends BaseController {

  constructor() {
    super("api/devtesting");
    this.router
      .post("/all", this.testGetTCsByDay)
      .post("/create", this.testCreateTCs)
  }

  async testGetTCsByDay(req, res, next) {

    try {
      let data = await devtestingService.testGetTCsByDay();
      res.send(data);
    } catch (error) {
      next(error);
    }

  }

  async testCreateTCs(req, res, next) {
    try {
      let data = await devtestingService.testCreateTCs();
      res.send(data);
    } catch (error) {
      next(error);
    }

  }



}