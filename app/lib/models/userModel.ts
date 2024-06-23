import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    email: {
      type: String,
      required: [true, "Please provide your email."],
      unique: true,
      lowercase: true,
    },
    photo: { type: String, default: "" },
    clerkUserId: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
