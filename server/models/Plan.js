import mongoose from "mongoose";
const Schema = mongoose.Schema;

const Plan = new Schema({
  PlanId: { type: String, required: true, unique: true },
  Title: { type: String, required: true },
  Description: [{ type: String, required: true }],
  Price: { type: String, required: true },
  Frequency: { type: String, enum: ['Monthly', '3 Month', 'Yearly'] },
  SubStatus: { type: String, required: true, enum: ["Free", "Basic", "Team0", "Team10", "Team20", "Team30", "Team40", "Team50", "Team60", "Team70", "Team80", "Team90", "Team100", "Ultimate", "Grandfather", "Admin"] }
},
  { timestamps: true, toJSON: { virtuals: true } }
);

export default Plan;
