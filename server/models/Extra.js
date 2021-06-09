import mongoose from "mongoose";
const Schema = mongoose.Schema;
let ObjectId = Schema.Types.ObjectId;

const Extra = new Schema(
  {
    Type: { type: String },
    Title: [{ type: String }]
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

export default Extra;
