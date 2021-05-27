import mongoose from "mongoose";
import ProfileSchema from "../models/Profile";
import ProjectSchema from "../models/Project";
import TimeClockSchema from "../models/TimeClock"
import PayPeriodSchema from "../models/PayPeriod"
import DateTestSchema from "../models/Date"
import SubscriptionSchema from "../models/Subscription"
import PlanSchema from "../models/Plan"
import UserSettingsSchema from "../models/UserSettings"
import ProjectSettingsSchema from "../models/ProjectSettings"
import ServerCacheSchema from "../models/ServerCache"
import FeedbackSchema from "../models/Feedback"

class DbContext {
  Profile = mongoose.model("Profile", ProfileSchema);
  Project = mongoose.model("Project", ProjectSchema);
  TimeClock = mongoose.model("TimeClock", TimeClockSchema);
  PayPeriod = mongoose.model("PayPeriod", PayPeriodSchema)
  DateTest = mongoose.model("DateTest", DateTestSchema)
  Subscription = mongoose.model("Subscription", SubscriptionSchema)
  Plan = mongoose.model("Plan", PlanSchema)
  UserSettings = mongoose.model("UserSettings", UserSettingsSchema)
  ProjectSettings = mongoose.model("ProjectSettings", ProjectSettingsSchema)
  ServerCache = mongoose.model("ServerCache", ServerCacheSchema)
  Feedback = mongoose.model("FeedbackSchema", FeedbackSchema)
}

export const dbContext = new DbContext();
