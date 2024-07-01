"use server";
import { v2 as cloudinary } from "cloudinary";

import { auth } from "@clerk/nextjs/server";
import connect from "../db";
import User from "../models/userModel";
import { revalidatePath } from "next/cache";
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function createUser(userData: any) {
  try {
    await connect();
    const user = await User.create(userData);
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    console.log(error);
    throw new Error("Error creating user");
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
