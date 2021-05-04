import { dbContext } from "../db/DbContext";
import { BadRequest } from "../utils/Errors";
import Axios from "axios";

const tokenApi = Axios.create({
  baseURL: "https://api-m.sandbox.paypal.com/v1/oauth2/token",
  timeout: 30000,
  withCredentials: true
})

const cstmHeaders = {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    "Accept": "application/json",
    "Accept-Language": "en_US"
  }
}

class SubscriptionsService {
  async createIdModel(id) {
    let data = await dbContext.SubIdModel.findOne({
      PlanId: id
    })
    if (!data) {
      data = await dbContext.SubIdModel.create({
        PlanId: id
      })
      return data
    } else throw new BadRequest(`This product with id: ${id} already exists in the database`)
  }
  async getAllIdModels() {
    let data = await dbContext.SubIdModel.find()
    return data
  }
}

export const subscriptionsService = new SubscriptionsService()