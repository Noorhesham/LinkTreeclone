import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema(
  {
    customer: { type: Schema.Types.ObjectId, ref: "User" },
    product: { type: [Schema.Types.ObjectId], ref: "Product" },
    createdAt: { type: Date, default: Date.now },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
orderSchema.pre(/^find/, function (next) {
  this.populate({
    path: "customer",
    select: "firstName userName lastName image photo email",
    model: "User",
  }).populate({
    path: "product",
    select: "name price image",
    model: "Product",
  });
  next();
});
const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default Order;
