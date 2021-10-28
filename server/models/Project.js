import mongoose from "mongoose";
const Schema = mongoose.Schema;
let ObjectId = Schema.Types.ObjectId;

const Project = new Schema(
  {
    CreatorEmail: { type: String, lowercase: true },
    Payee: { type: String, required: true },
    PayPeriod: { type: String, required: true },
    PayType: { type: String },
    Start: { type: Date },
    End: { type: Date },
    InvoiceDay: { type: String },
    Rate: { type: Number, required: true },
    Active: { type: Boolean, default: true },
    TimeClocks: [{ type: Object }],
    InvoiceGroups: [{ type: ObjectId, ref: "PayPeriod" }],
    Active: { type: Boolean, default: true },
    ProjectSettings: { type: ObjectId, ref: "ProjectSettings" }
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

export default Project;
