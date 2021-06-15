import express from "express";
import BaseController from "../utils/BaseController";
import auth0provider from "@bcwdev/auth0provider";
import { subscriptionsService } from "../services/SubscriptionsService";
import { profilesService } from "../services/ProfilesService";
import { BadRequest } from "../utils/Errors";

export class SubscriptionsController extends BaseController {
  constructor() {
    super("api/subscriptions");
    this.router
      .use(auth0provider.getAuthorizedUserInfo)
      .put("/usepromocode", this.usePromoCode)
      .put("/updatesubscription", this.updateSubscription)
      // .put("/cancel", this.cancelSubscription)
      .post("/addpromocodes", this.addPromoCodes)
      .get("/getpromocode", this.getPromoCode)
      .put("/getallpromocodes", this.getAllPromoCodes)
      .get("/getpromocodecount", this.getPromoCodeCount)
      .put("/togglePromoCodeReleased/:id", this.togglePromoCodeReleased)
  }
  async updateSubscription(req, res, next) {
    try {
      let profile = await profilesService.getProfile(req.userInfo);
      req.body.userId = profile._id
      let data = await subscriptionsService.updateSubscription(req.body, req.userInfo)
      data.PayPalData = {
        billingToken: data.PayPalData.billingToken,
        orderID: data.PayPalData.orderID,
        plan_id: data.PayPalData.plan_id,
        subscriptionID: data.PayPalData.subscriptionID
      }
      res.send(data)
    } catch (error) {
      next(error);
    }
  }
  // async cancelSubscription(req, res, next) {
  //   try {
  //     await subscriptionsService.cancelSubscription(req.userInfo)
  //   } catch (error) {
  //     next(error)
  //   }
  // }
  async usePromoCode(req, res, next) {
    try {
      let data = await subscriptionsService.usePromoCode(req.data)
    } catch (error) {
      next(error)
    }
  }
  async addPromoCodes(req, res, next) {
    try {
      let profile = await profilesService.getProfile(req.userInfo)
      if (!profile.IsAdmin) {
        throw new BadRequest("You are not authorized to access this data")
      }
      let data = await subscriptionsService.addPromoCodes(req.body)
      res.send(data)
    } catch (error) {
      next(error)
    }
  }
  async getPromoCode(req, res, next) {
    try {
      let code = await subscriptionsService.getPromoCode(req.body)
      res.send(code)
    } catch (error) {
      next(error)
    }
  }
  async getAllPromoCodes(req, res, next) {
    try {
      let profile = await profilesService.getProfile(req.userInfo)
      if (!profile.IsAdmin) {
        throw new BadRequest("You are not authorized to access this data")
      }
      let codes = await subscriptionsService.getAllPromoCodes(req.body)
      res.send(codes)
    } catch (error) {
      next(error)
    }
  }
  async getPromoCodeCount(req, res, next) {
    try {
      let profile = await profilesService.getProfile(req.userInfo)
      if (!profile.IsAdmin) {
        throw new BadRequest("You are not authorized to access this data")
      }
      let codes = await subscriptionsService.getPromoCodeCount()
      res.send(codes)
    } catch (error) {
      next(error)
    }
  }
  async togglePromoCodeReleased(req, res, next) {
    try {
      let profile = await profilesService.getProfile(req.userInfo)
      if (!profile.IsAdmin) {
        throw new BadRequest("You are not authorized to access this data")
      }
      let codes = await subscriptionsService.togglePromoCodeReleased(req.params.id)
      res.send(codes)
    } catch (error) {
      next(error)
    }
  }
}
