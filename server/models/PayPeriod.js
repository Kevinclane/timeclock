import mongoose from "mongoose";
const Schema = mongoose.Schema;

const PayPeriod = new Schema({
  ProjectId: { type: String, required: true },
  CreatorEmail: { type: String, required: true },
  StartDay: { type: Date, required: true },
  EndDay: { type: Date, required: true },
  InvoiceNumber: { type: Number, default: 1 },
  Current: { type: Boolean, default: false }
},
  { timestamps: true, toJSON: { virtuals: true } }
);

export default PayPeriod