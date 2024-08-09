import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema(
  {
    customer : { type: Schema.Types.ObjectId, ref: "User" },
    product : { type: Schema.Types.ObjectId, ref: "Product" },
    quantity : { type: Number, default: 1 },
    createdAt: { type: Date, default: Date.now },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
 
const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default Order;
