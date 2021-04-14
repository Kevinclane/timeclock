import { dbContext } from "../db/DbContext";
import { BadRequest } from "../utils/Errors";

class SubscriptionService {
  async createIdModel(id) {
    let data = await dbContext.SubIdModelSchema.findOne({
      ProductId: id
    })
    if (!data) {
      data = await dbContext.SubIdModelSchema.create({
        ProductId: id
      })
      return data
    } else throw new BadRequest(`This product with id: ${id} already exists in the database`)
  }
  async getAllIdModels() {
    let data = await dbContext.SubIdModelSchema.find()
    return data
  }
}

export const subscriptionService = new SubscriptionService()