import { dbContext } from "../db/DbContext";
import { BadRequest } from "../utils/Errors";


class SubscriptionsService {
  async updateSubscription(reqData) {
    let plan = await dbContext.Plan.findOne({
      PlanId: reqData.paypal.plan_id
    })
    let update = {
      UserId: reqData.userId,
      PayPalData: reqData.paypal,
      SubStatus: plan.SubStatus
    }
    let data = await dbContext.Subscription.findOneAndUpdate(
      {
        UserId: reqData.userId
      },
      { $set, update },
      { runValidators: true, setDefaultsOnInsert: true, new: true }
    )
    return data
  }

}

export const subscriptionsService = new SubscriptionsService()