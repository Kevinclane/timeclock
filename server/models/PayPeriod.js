import mongoose from "mongoose";
const Schema = mongoose.Schema;

const PayPeriod = new Schema({
  ProjectId: { type: String, required: true },
  CreatorEmail: { type: String, required: true },
  StartDay: { type: String, required: true },
  EndDay: { type: String, required: true },
  Current: { type: Boolean, default: true }
},
  { timestamps: true, toJSON: { virtuals: true } }
);

export default PayPeriod