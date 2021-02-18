import mongoose from "mongoose";
import ProfileSchema from "../models/Profile";
import ProjectSchema from "../models/Project";
import TimeClockSchema from "../models/TimeClock"
class DbContext {
  Profile = mongoose.model("Profile", ProfileSchema);
  Project = mongoose.model("Project", ProjectSchema);
  TimeClock = mongoose.model("TimeClock", TimeClockSchema)
}

export const dbContext = new DbContext();
