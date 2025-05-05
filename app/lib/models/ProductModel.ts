import mongoose, { Schema } from "mongoose";

const image = new Schema(
  {
    secure_url: { type: String, required: true },
    public_id: { type: String, required: true },
  },
  { _id: false }
); // Prevent creation of _id field for subdocuments

const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    image: { type: [image], required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    currentStock: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);
export default Product;
