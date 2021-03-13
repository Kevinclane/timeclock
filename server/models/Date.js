import mongoose from "mongoose";
const Schema = mongoose.Schema;

const DateTest = new Schema({
  CreatorEmail: { type: String, required: true },
  DateDate: { type: Date, required: true },
  StringDate: { type: String, required: true },
  NewDateDate: { type: Date, required: true },
  NewDateString: { type: String, required: true },
  MomentDate: { type: Date, required: true },
  MomentString: { type: String, required: true },
  MomentConvertDate: { type: Date, required: true },
  MomentConvertString: { type: String, required: true }
},
  { timestamps: true, toJSON: { virtuals: true } }
);

export default DateTest