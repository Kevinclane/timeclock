import { dbContext } from "../db/DbContext";
import { BadRequest } from "../utils/Errors";


class PlansService {
  async insertPlan(reqData) {
    let data = await dbContext.Plan.findOne({
      PlanId: reqData.PlanId
    })
    if (!data) {
      data = await dbContext.Plan.create({
        Title: reqData.Title,
        Description: reqData.Description,
        Price: reqData.Price,
        PlanId: reqData.PlanId
      })
      return data
    } else throw new BadRequest(`This product with id: ${id} already exists in the database`)
  }
  async getAllPlans() {
    let data = await dbContext.Plan.find()
    return data
  }
}

export const plansService = new PlansService()