import mongoose from "mongoose";

const Schema = mongoose.Schema;
let ObjectId = Schema.Types.ObjectId;

const Feedback = new Schema({
  UserId: { type: ObjectId, required: true },
  CreatorEmail: { type: String, required: true },
  Type: { type: String, required: true },
  Text: { type: String, required: true },
  Active: { type: Boolean, default: true }
},
  { timestamps: true, toJSON: { virtuals: true } }
);

export default Feedback;
