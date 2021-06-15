import mongoose from "mongoose";
const Schema = mongoose.Schema;
let ObjectId = Schema.Types.ObjectId;

const Profile = new Schema(
  {
    SubStatus: { type: String },
    Details: { type: String, required: true },
    Code: { type: String, required: true },
    Type: { type: String, required: true },
    Released: { type: Boolean, default: false }
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

export default Profile;
