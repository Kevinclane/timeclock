import mongoose from "mongoose";
const Schema = mongoose.Schema;

const TimeTrack = new Schema(
  {
    subs: [{ type: String, unique: true }],
    email: { type: String, lowercase: true, unique: true },
    times: [{ type: Object }]
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

export default TimeTrack;
