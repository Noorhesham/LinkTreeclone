import mongoose, { Schema } from "mongoose";

const LinkSchema = new Schema({
  provider: { type: String, required: true },
  link: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  name: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Link = mongoose.models.Link || mongoose.model("Link", LinkSchema);
export default Link;
