import mongoose from "mongoose";
const Schema = mongoose.Schema;
let ObjectId = Schema.Types.ObjectId;

const Project = new Schema(
  {
    CreatorEmail: { type: String, lowercase: true },
    Title: { type: String, required: true },
    Payee: { type: String, required: true },
    PayPeriod: { type: String, required: true },
    PayType: { type: String },
    Start: { type: String },
    End: { type: String },
    InvoiceDay: { type: String },
    Rate: { type: Number, required: true },
    SalaryFrequency: { type: String },
    Active: { type: Boolean, default: true },
    TimeClocks: [{ type: Object }],
    InvoiceGroups: [{ type: Object }]
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

export default Project;
