import mongoose from "mongoose";
const Schema = mongoose.Schema;
let ObjectId = Schema.Types.ObjectId;

const ServerCache = new Schema(
  {
    CreatorEmail: { type: String, lowercase: true },
    Exp: { type: Date, required: true },
    Type: { type: String, required: true }
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

export default ServerCache;
