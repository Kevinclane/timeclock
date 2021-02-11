import mongoose from "mongoose";
const Schema = mongoose.Schema;

const Project = new Schema(
  {
    creatorEmail: { type: String, lowercase: true },
    Title: { type: String, required },
    Payee: { type: String, required },
    PayPeriod: { type: String },
    PayType: { type: String, required },
    Start: { type: Date },
    End: { type: Date },
    InvoiceDay: { type: String },
    Rate: { type: Number, required },
    SalaryFrequency: { type: String }
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

export default Project;
