import mongoose from "mongoose";
const Schema = mongoose.Schema;
let ObjectId = Schema.Types.ObjectId;

const Project = new Schema(
  {
    CreatorEmail: { type: String, lowercase: true },
    OT: { type: Boolean, default: true },
    OTRate: { type: Number, default: 1.5 },
    NameOnInvoice: { type: String },
    InvoiceNumber: { type: Number, default: 0 },
    RoundTime: { type: Boolean, default: false },
    RoundTo: { type: Number, enum: [5, 10, 15, 30, 60] },
    RoundFrequency: { type: String, enum: ["TC", "Day", "Week", "Total"] },
    Completed: { type: Boolean, default: false }
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

export default Project;
