import { dbContext } from "../db/DbContext";
import { BadRequest } from "../utils/Errors";
import Axios from "axios"



async function getSubStatus() {
  try {
    let data = await dbContext.Extra.findOne({ Type: "PayPalCred" })
    let buff = Buffer.from(`${data.Field1}:${data.Field2}`, "utf8");
    let base64data = buff.toString('base64');
    const payPalApi = Axios.create({
      baseURL: "https://api-m.paypal.com",
      timeout: 30000,
      withCredentials: true,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept-Language": "en_US",
        "Authorization": `Basic ${base64data}`
      }
    })
    let res = await payPalApi.post("/v1/oauth2/token", "grant_type=client_credentials")
    return res.data
  } catch (error) {
    throw new BadRequest(error)
  }
}

class SubscriptionsService {
  async updateSubscription(reqData) {
    let plan = await dbContext.Plan.findOne({
      PlanId: reqData.paypal.plan_id
    })
    let data = await dbContext.Subscription.findOneAndUpdate(
      {
        UserId: reqData.userId
      },
      {
        PayPalData: reqData.paypal,
        SubStatus: plan.SubStatus
      },
      { runValidators: true, setDefaultsOnInsert: true, new: true }
    )
    return data
  }
  // async getSubscriptionData(profile) {
  // }

  async test() {
    let data = await getSubStatus()
    return data
  }

}

export const subscriptionsService = new SubscriptionsService()