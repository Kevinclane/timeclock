import mongoose from "mongoose";
const Schema = mongoose.Schema;
let ObjectId = Schema.Types.ObjectId;

const Project = new Schema(
  {
    CreatorEmail: { type: String, lowercase: true },
    OT: { type: Boolean, default: true },
    OTRate: { type: Number, default: 1.5 }
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

export default Project;
