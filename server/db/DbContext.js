import mongoose from "mongoose";
import ProfileSchema from "../models/Profile";
import ProjectSchema from "../models/Project";
import TimeClockSchema from "../models/TimeClock"
import PayPeriodSchema from "../models/PayPeriod"
import DateTestSchema from "../models/Date"
import SubSchema from "../models/Sub"
import SubIdModelSchema from "../models/SubIdModel"
import UserSettingsSchema from "../models/UserSettings"

class DbContext {
  Profile = mongoose.model("Profile", ProfileSchema);
  Project = mongoose.model("Project", ProjectSchema);
  TimeClock = mongoose.model("TimeClock", TimeClockSchema);
  PayPeriod = mongoose.model("PayPeriod", PayPeriodSchema)
  DateTest = mongoose.model("DateTest", DateTestSchema)
  Sub = mongoose.model("Sub", SubSchema)
  SubIdModelSchema = mongoose.model("SubIdModel", SubIdModelSchema)
  UserSettings = mongoose.model("UserSettings", UserSettingsSchema)
}

export const dbContext = new DbContext();
