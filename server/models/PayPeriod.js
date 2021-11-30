import mongoose from "mongoose";
const Schema = mongoose.Schema;
let ObjectId = Schema.Types.ObjectId;

const PayPeriod = new Schema({
  ProjectId: { type: String, required: true },
  CreatorEmail: { type: String, required: true },
  StartDay: { type: Date, required: true },
  EndDay: { type: Date, required: true },
  ReadableDates: { type: String, required: true },
  TotalTime: { type: Number, default: 0 },
  ReadableTime: { type: String, default: "0:00" },
  TotalPay: { type: Number, default: 0 },
  InvoiceNumber: { type: Number, default: 0 },
  InvoiceDate: { type: Date },
  Current: { type: Boolean, default: false },
  Weeks: [{ type: Object }]
},
  { timestamps: true, toJSON: { virtuals: true } }
);

export default PayPeriod