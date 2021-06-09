import { dbContext } from "../db/DbContext";
import { BadRequest } from "../utils/Errors";

async function createExtraSchemaIfNeeded(type) {
  try {
    let data = await dbContext.Extra.findOne({ Type: type })
    if (!data) {
      await dbContext.Extra.create(
        {
          Type: type
        }
      )
    }
  } catch (error) {
    console.error(error)
  }
}

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
        PlanId: reqData.PlanId,
        SubStatus: reqData.Status
      })
      return data
    } else throw new BadRequest(`This product with id: ${id} already exists in the database`)
  }
  async getAllPlans() {
    let data = await dbContext.Plan.find()
    return data
  }
  async addPlanStatus(reqData, user) {
    let profile = await dbContext.Profile.findOne({
      Email: user.email
    })
    if (!profile.IsAdmin) {
      throw new BadRequest("You are not authorized to alter this data")
    } else {
      await createExtraSchemaIfNeeded(reqData.Type)
      let statuses = await dbContext.Extra.findOneAndUpdate(
        { Type: reqData.Type },
        { $addToSet: { Title: reqData.Title } },
        { new: true }
      )
      return statuses
    }
  }
  async removePlanStatus(reqData, user) {
    let profile = await dbContext.Profile.findOne({
      Email: user.email
    })
    if (!profile.IsAdmin) {
      throw new BadRequest("You are not authorized to alter this data")
    } else {
      let statuses = await dbContext.Extra.findOneAndUpdate(
        { Type: "PlanStatuses" },
        { $pull: { Title: reqData.Title } },
        { new: true }
      )
      return statuses
    }
  }
  async getPlanStatuses(user) {
    let profile = await dbContext.Profile.findOne({
      Email: user.email
    })
    if (!profile.IsAdmin) {
      throw new BadRequest("You are not authorized to get this data")
    } else {
      let statuses = await dbContext.Extra.find({
        Type: "PlanStatuses"
      })
      return statuses
    }
  }
}

export const plansService = new PlansService()