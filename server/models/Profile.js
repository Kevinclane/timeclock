import mongoose from "mongoose";
const Schema = mongoose.Schema;
let ObjectId = Schema.Types.ObjectId;

const Profile = new Schema(
  {
    Subs: [{ type: String, unique: true }],
    Email: { type: String, lowercase: true, unique: true },
    Name: { type: String, required: true },
    Picture: { type: String },
    Subscription: { type: ObjectId, ref: "Subscription" },
    UserSettings: { type: ObjectId, ref: "UserSettings" },
    IsAdmin: { type: Boolean, default: false }
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

export default Profile;
