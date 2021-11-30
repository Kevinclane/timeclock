import BaseController from "../utils/BaseController";
import auth0provider from "@bcwdev/auth0provider";
import { payPeriodsService } from "../services/PayPeriodsService"

export class PayPeriodsController extends BaseController {
  constructor() {
    super("api/payperiods");
    this.router
      .use(auth0provider.getAuthorizedUserInfo)
      .get("/:id", this.getPayPeriodById)
      .put("/:id", this.updatePayPeriod)

  }
  async getPayPeriodById(req, res, next) {
    try {
      let data = await payPeriodsService.getPayPeriodById(req.params.id, req.userInfo.email);
      res.send(data);
    } catch (error) {
      next(error);
    }
  }
  async updatePayPeriod(req, res, next) {
    try {
      let data = await payPeriodsService.updatePayPeriod(req.body);
      res.send(data);
    } catch (error) {
      next(error);
    }
  }

}
