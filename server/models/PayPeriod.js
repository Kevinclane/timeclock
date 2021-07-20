import mongoose from "mongoose";
const Schema = mongoose.Schema;

const PayPeriod = new Schema({
  ProjectId: { type: String, required: true },
  CreatorEmail: { type: String, required: true },
  StartDay: { type: Date, required: true },
  EndDay: { type: Date, required: true },
  ReadableDates: { type: String, required: true },
  PPHours: { type: Number, default: 0 },
  PPHHMM: { type: String, default: "0:00" },
  PPPay: { type: Number, default: 0 },
  PPHours: { type: Number, default: 0 },
  PPHHMM: { type: String, default: "0:00" },
  InvoiceNumber: { type: Number, default: 1 },
  Current: { type: Boolean, default: false },
  Weeks: [{ type: Object, required: true }]
},
  { timestamps: true, toJSON: { virtuals: true } }
);

export default PayPeriod