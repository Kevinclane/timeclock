import mongoose from "mongoose";
const Schema = mongoose.Schema;
let ObjectId = Schema.Types.ObjectId;

const Sub = new Schema({
  UserId: { type: ObjectId, ref: "Profile" },
  PayPalId: { type: String, required: true },
  SubStatus: { type: String, required: true, default: "Free", enum: ["Free", "Basic", "Team0", "Team10", "Team20", "Team30", "Team40", "Team50", "Team60", "Team70", "Team80", "Team90", "Team100", "Ultimate", "Grandfather"] },
  PaymentFrequency: { type: Number, enum: [1, 3, 6, 12] },
  Active: { type: Boolean, default: false },
},
  { timestamps: true, toJSON: { virtuals: true } }
);

export default Sub;
