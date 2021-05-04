import mongoose from "mongoose";
const Schema = mongoose.Schema;

const SubIdModel = new Schema({
  PlanId: { type: String, required: true, unique: true },
  Title: { type: String, required: true },
  Description: { type: String, required: true },
  Price: { type: Number, required: true }
},
  { timestamps: true, toJSON: { virtuals: true } }
);

export default SubIdModel;
