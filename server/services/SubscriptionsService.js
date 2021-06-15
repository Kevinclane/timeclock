import { dbContext } from "../db/DbContext";
import { BadRequest } from "../utils/Errors";
import Axios from "axios"
import moment from "moment"

async function generateCode() {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < 6; i++) {
    result += characters.charAt(
      Math.floor(Math.random() * charactersLength)
    );
  }
  return result;
}

async function createToken() {
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
    let PPBT = await dbContext.Extra.create(
      {
        Type: "PPBT",
        Field1: res.data.access_token,
        ExpDate: moment().add(15, "minutes")
      }
    )
    return PPBT
  } catch (error) {
    throw new BadRequest(error)
  }
}

async function findToken() {
  try {
    let data = await dbContext.Extra.findOne({ Type: "PPBT" })
    if (!data) {
      data = await createToken()
    }
    let expired = moment(data.ExpDate).isSameOrBefore(moment())
    if (expired) {
      await dbContext.Extra.findOneAndDelete({ Type: "PPBT" })
      data = await createToken()
    }
    return data.Field1
  } catch (error) {
    throw new BadRequest(error)
  }
}

async function getSubStatus(id) {
  try {
    let token = await findToken()
    const payPalApi = Axios.create({
      baseURL: "https://api-m.paypal.com",
      timeout: 30000,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        "Accept-Language": "en_US",
        "Authorization": `Bearer ${token}`
      }
    })
    let status = await payPalApi.get("/v1/billing/subscriptions/" + id)
    return status.data
  } catch (error) {
    throw new BadRequest(error)
  }
}

class SubscriptionsService {
  async updateSubscription(reqData, user) {
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
    await dbContext.Profile.findOneAndUpdate(
      {
        Email: user.email
      },
      {
        Plan: plan._id
      }
    )
    return data
  }
  async getSubscriptionData(profile) {
    if (profile.Subscription.SubStatus == "Free" || profile.Subscription.SubStatus == "Admin" || profile.SubStatus == "Grandfather") {
      return profile
    } else {
      profile.PPSubData = await getSubStatus(profile.Subscription.PayPalData.subscriptionID)
      return profile
    }
  }

  // cancelSubscription(user) {
  //   let profile = await dbContext.Profile.findOneAndUpdate(
  //     { Email: user.email },
  //     {

  //     },
  //     { new: true }
  //   )
  // }

  async addPromoCodes(codes) {
    let i = 0
    while (i < codes.Amount) {
      let code = await generateCode()
      let codeObj = {
        Code: code,
        Details: codes.Details,
        Type: codes.Type
      }
      if (codes.SubStatus) {
        codeObj.SubStatus = codes.SubStatus
      }
      await dbContext.PromoCode.create(codeObj)
      i++
    }
    return `Created ${i} codes`
  }

  async getPromoCode(code) {
    let data = await dbContext.PromoCode.findOne({ Code: code })
    return data
  }
  async getAllPromoCodes(reqObj) {
    let pwObj = await dbContext.Extra.findOne(
      {
        Type: "PromoCodePW",
        Field2: reqObj.pw
      }
    )
    if (!pwObj) {
      throw new BadRequest("Incorrect Password")
    } else {
      let codes = await dbContext.PromoCode.find()
      return codes
    }
  }

  async getPromoCodeCount() {
    let codes = await dbContext.PromoCode.find()
    let counts = {
      FreeAccess: 0
    }
    let i = 0
    while (i < codes.length) {
      counts[codes[i].Type]++
      i++
    }
    return counts
  }
  async togglePromoCodeReleased(id) {
    let code = await dbContext.PromoCode.findOne(
      { _id: id }
    )
    await dbContext.PromoCode.findOneAndUpdate(
      { _id: id },
      { Released: !code.Released },
      { new: true }
    )
    let codes = await dbContext.PromoCode.find()
    return codes
  }

}

export const subscriptionsService = new SubscriptionsService()