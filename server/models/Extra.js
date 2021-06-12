import mongoose from "mongoose";
const Schema = mongoose.Schema;
let ObjectId = Schema.Types.ObjectId;

const Extra = new Schema(
  {
    Type: { type: String },
    Title: [{ type: String }],
    Field1: { type: String },
    Field2: { type: String },
    ExpDate: { type: Date }
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

export default Extra;
