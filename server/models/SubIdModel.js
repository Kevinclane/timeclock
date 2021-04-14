import mongoose from "mongoose";
const Schema = mongoose.Schema;

const SubIdModel = new Schema({
  ProductId: { type: String, required: true, unique: true }
},
  { timestamps: true, toJSON: { virtuals: true } }
);

export default SubIdModel;
