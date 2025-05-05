"use server";
import { v2 as cloudinary } from "cloudinary";

import { auth } from "@clerk/nextjs/server";
import connect from "../db";
import User from "../models/userModel";
import { revalidatePath } from "next/cache";
import Product from "../models/ProductModel";
import Order from "../models/Order";
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function createUser(userData: any) {
  console.log("🔄 createUser function called with data:", userData);

  try {
    // Ensure DB connection
    await connect();
    console.log("✅ DB connection successful in createUser");

    // Generate a random username if not provided
    if (!userData.userName) {
      userData.userName = `user_${Math.random().toString(36).substring(2, 10)}`;
      console.log("ℹ️ Generated random username:", userData.userName);
    }

    // Create the user
    console.log("⏳ Attempting to create user in DB...");
    const user = await User.create(userData);
    console.log("✅ User successfully created in DB with ID:", user._id);

    return JSON.parse(JSON.stringify(user));
  } catch (error: any) {
    console.error("❌ Error in createUser:", error);

    // More detailed error message for duplicate key errors
    if (error.code === 11000) {
      console.error("❌ Duplicate key error:", error.keyValue);
      if (error.keyValue.email) {
        throw new Error(`Email ${error.keyValue.email} already exists`);
      } else if (error.keyValue.userName) {
        throw new Error(`Username ${error.keyValue.userName} already exists`);
      } else if (error.keyValue.clerkUserId) {
        throw new Error(`User with ID ${error.keyValue.clerkUserId} already exists`);
      }
    }

    throw new Error(`Error creating user: ${error.message}`);
  }
}

export async function updateUser(data: any, id: string) {
  try {
    await connect();
    const user = await User.findOneAndUpdate({ clerkUserId: id }, data);
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    console.log(error);
    throw new Error("Error updating user");
  }
}
export async function addCoverImage({
  secure_url,
  public_id,
  color,
}: {
  secure_url?: string;
  public_id?: string;
  color?: string;
}) {
  const { userId } = await auth();
  try {
    if (!color) {
      const user = await User.findOneAndUpdate(
        { clerkUserId: userId },
        {
          coverImage: { secure_url, public_id },
        },
        { new: true }
      ).lean();
      revalidatePath("/create");

      if (!user) return { error: "failed to add cover image " };
      return { success: "updated sucessfully", data: { user } };
    } else {
      const user = await User.findOneAndUpdate(
        { clerkUserId: userId },
        {
          coverColor: color,
        },
        { new: true }
      ).lean();
      if (!user) return { error: "failed to add cover image " };
      revalidatePath("/create");
      return { success: "updated sucessfully", data: { user } };
    }
  } catch (error) {
    console.log(error);
  }
}

export async function deleteImage(publicId: string) {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    if (!result) throw new Error("An error occurred while processing the request. Please try again!");
    return { success: "Image deleted successfully!", status: 200 };
  } catch (error) {
    console.log(error);
  }
}

export async function toggleImg() {
  try {
    const { userId } = await auth();
    const user = await User.findOne({ clerkUserId: userId });
    if (!user) return { error: "User not found" };
    user.isImg = !user.isImg;
    await user.save();
    return { success: "Image toggled successfully!", status: 200 };
  } catch (error) {
    console.log(error);
  }
}
export async function getProducts(page = 1, limit = 8) {
  connect();
  const skip = (page - 1) * limit;
  const products = await Product.find({}).skip(skip).limit(8).lean();

  const totalProducts = await Product.countDocuments({});
  const totalPages = Math.ceil(totalProducts / limit);

  const productObj = JSON.parse(JSON.stringify(products));
  return { status: 200, data: { products: productObj, totalPages } };
}
export async function addToCart(productId: string) {
  const { userId } = await auth();
  const user = await User.findOne({ clerkUserId: userId });
  if (!user) return { error: "User not found" };
  user.cart = [...user.cart, productId];
  await user.save();

  return { success: "Cart updated successfully!", status: 200 };
}
export async function deleteFromCart(productId: string) {
  const { userId } = await auth();
  const user = await User.findOne({ clerkUserId: userId });
  if (!user) return { error: "User not found" };
  const index = user.cart.findIndex((item: any) => item._id.toString() === productId);

  if (index !== -1) {
    user.cart.splice(index, 1);
  }

  await user.save();
  revalidatePath("/store");
  return { success: "Cart Item deleted successfully!", status: 200, data: { cart: user.cart } };
}

export async function getCart() {
  await connect();
  const { userId } = await auth();
  const user = await User.findOne({ clerkUserId: userId })
    .populate({
      path: "cart",
      model: "Product",
    })
    .lean();
  console.log(user);
  if (!user) return { error: "User not found" };
  // Use type assertion to safely access cart
  const userData = user as any; // Type assertion
  return { status: 200, data: { cart: userData.cart || [] } };
}
export async function handleOrder() {
  const { userId } = await auth();
  const user = await User.findOne({ clerkUserId: userId });
  if (!user) return { error: "User not found" };
  const order = await Order.create({ product: user.cart, customer: user._id });
  user.cart = [];
  await user.save();
  revalidatePath("/store");
  console.log(order);
  return { success: "Order Placed successfully!", status: 200 };
}
