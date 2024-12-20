import mongoose from "mongoose";
const Schema = mongoose.Schema;

const TimeClock = new Schema({
  ProjectId: { type: String, required: true },
  CreatorEmail: { type: String, required: true },
  Comment: { type: String },
  StartTime: { type: Date, required: true },
  EndTime: { type: Date },
  Current: { type: Boolean, default: true }
},
  { timestamps: true, toJSON: { virtuals: true } }
);

export default TimeClock