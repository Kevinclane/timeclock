import mongoose from "mongoose";
const Schema = mongoose.Schema;

const TimeClock = new Schema({
  ProjectId: { type: String, required: true },
  CreatorEmail: { type: String, required: true },
  StartTime: { type: Date, required: true },
  EndTime: { type: Date },
  Messages: [{ type: String }]
},
  { timestamps: true, toJSON: { virtuals: true } }
);

export default TimeClock