import { createHash, randomBytes } from "crypto";
import mongoose, { Schema, Document } from "mongoose";

export interface UserProps extends Document {
  firstName: string;
  lastName: string;
  email: string;
  photo: string;
  _id: string;
  id:String
  createdAt: Date;
}

const UserSchema = new Schema<UserProps>(
  {
    firstName: { type: String, required: [true, "Please tell us your first name."] },
    lastName: { type: String, required: [true, "Please tell us your last name."] },
    createdAt: { type: Date, default: Date.now },
    email: {
      type: String,
      required: [true, "Please provide your email."],
      unique: true,
      lowercase: true,
    },
    photo: { type: String, default: "" },

  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);


const User = mongoose.models.User || mongoose.model<UserProps>("User", UserSchema);
export default User;
