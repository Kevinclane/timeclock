import mongoose from "mongoose";
const Schema = mongoose.Schema;
let ObjectId = Schema.Types.ObjectId;

const Profile = new Schema(
  {
    Subs: [{ type: String, unique: true }],
    Email: { type: String, lowercase: true, unique: true },
    Name: { type: String, required: true },
    FirstName: { type: String },
    LastName: { type: String },
    Phone: { type: Number },
    Website: { type: String },
    LinkedIn: { type: String },
    Picture: { type: String },
    Subscription: { type: ObjectId, ref: "Subscription" },
    Plan: { type: ObjectId, ref: "Plan" },
    UserSettings: { type: ObjectId, ref: "UserSettings" },
    TrialUsed: { type: Boolean, default: false },
    PPSubData: { type: Object },
    IsAdmin: { type: Boolean, default: false },
    BusinessName: { type: String },
    BusinessPhone: { type: Number },
    BusinessAddress: { type: String },
    BusinessWebsite: { type: String }
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

export default Profile;
