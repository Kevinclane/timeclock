import mongoose from "mongoose";
import ProfileSchema from "../models/Profile";
import TimeTrackSchema from "../models/TimeTrack"
class DbContext {
  Profile = mongoose.model("Profile", ProfileSchema);
  TimeTrack = mongoose.model("TimeTrack", TimeTrackSchema)
}

export const dbContext = new DbContext();
