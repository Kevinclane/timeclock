import mongoose from "mongoose";
const Schema = mongoose.Schema;
let ObjectId = Schema.Types.ObjectId;

const UserSettings = new Schema({
  UserId: { type: ObjectId, ref: "Profile" },
  EmailSubReminder: { type: Boolean, default: true },
  EmailNews: { type: Boolean, default: true },
  EmailPolls: { type: Boolean, default: true },
  UseName: { type: Boolean, default: true }
},
  { timestamps: true, toJSON: { virtuals: true } }
);

export default UserSettings;
