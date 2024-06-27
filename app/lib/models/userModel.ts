import mongoose, { Schema } from "mongoose";
import Link from "./linkModel"; // Importing Link model to avoid circular dependency issues

const UserSchema = new Schema(
  {
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    email: {
      type: String,
      unique: true,
      lowercase: true,
    },
    bio: { type: String, default: "" },
    photo: { type: String, default: "" },
    clerkUserId: { type: String, unique: true },
    createdAt: { type: Date, default: Date.now },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

UserSchema.virtual("links", {
  ref: "Link",
  localField: "_id",
  foreignField: "userId",
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
