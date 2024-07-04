import mongoose, { Schema } from "mongoose";
import Link from "./linkModel"; // Importing Link model to avoid circular dependency issues

const CoverImageSchema = new Schema(
  {
    secure_url: { type: String, required: true },
    public_id: { type: String, required: true },
  },
  { _id: false }
); // Prevent creation of _id field for subdocuments

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
    isImg: { type: Boolean, default: true },
    coverImage: { type: CoverImageSchema, required: false },
    coverColor: { type: String },
    clerkUserId: { type: String, unique: true },
    createdAt: { type: Date, default: Date.now },
    font: { type: String, default: "Poppins" },
    links: {
      type: [{ type: Schema.Types.ObjectId, ref: "Link" }],
      required: false,
    },
    userName: { type: String, unique: true },
    theme: { type: String, default: "" },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
