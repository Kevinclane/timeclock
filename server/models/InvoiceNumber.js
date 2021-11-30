import mongoose from "mongoose";
const Schema = mongoose.Schema;
let ObjectId = Schema.Types.ObjectId;

const InvoiceNumber = new Schema({
  CreatorId: { type: ObjectId, ref: "Profile" },
  Number: { type: Number, default: 0 },
  PayPeriod: { type: ObjectId, ref: "PayPeriod" }
},
  { timestamps: true, toJSON: { virtuals: true } }
);

export default InvoiceNumber;