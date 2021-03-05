import mongoose from "mongoose";
const Schema = mongoose.Schema;

const TimeClock = new Schema({
  ProjectId: { type: String, required: true },
  CreatorEmail: { type: String, required: true },
  StartTime: { type: String, required: true },
  EndTime: { type: String },
  Current: { type: Boolean, default: true },
  Messages: [{ type: String }]
},
  { timestamps: true, toJSON: { virtuals: true } }
);

export default TimeClock