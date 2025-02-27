"use server";

import { auth } from "@clerk/nextjs/server";
import connect from "../lib/db";
import Link from "../lib/models/linkModel";
import User from "../lib/models/userModel";
import Product from "../lib/models/ProductModel";
import { deleteImage } from "../lib/actions/actions";
import { revalidatePath } from "next/cache";
import Order from "../lib/models/Order";

export async function addLink(data: { link: string; provider: string }, userId: string) {
  console.log(data, userId);
  await connect();
  const link = await Link.create({
    link: data.link,
    provider: data.provider,
    name: data?.name,
    userId,
  });
  const updatedUser = await User.findByIdAndUpdate(userId, {
    $push: { links: link._id },
  });
  console.log(updatedUser);
  if (!link) return { error: "Link not added !" };
  const linkOBJ = JSON.parse(JSON.stringify(updatedUser));
  return { success: "Link added successfully !", status: 200, data: { linkOBJ } };
}

export async function updateLink(data: { link: string; provider: string; _id: string }, id?: string, userId?: string) {
  try {
    console.log(data, id);
    await connect();
    const linknew = await Link.findByIdAndUpdate(data._id, {
      link: data.link,
      provider: data.provider,
      name: data.name,
    });
    console.log(linknew, data, id);
    if (!linknew) return { error: "Link not updated !" };
    const linkOBJ = JSON.parse(JSON.stringify(linknew));
    return { success: "Link updated successfully !", status: 200, data: { linkOBJ } };
  } catch (error) {
    console.log(error);
  }
}
export async function updateOrderLinks(data: any) {
  try {
    const { userId } = await auth();
    await connect();
    const user = await User.findOneAndUpdate({ clerkUserId: userId }, { links: data });
    if (!user) return { error: "User not updated !" };
    const linkOBJ = JSON.parse(JSON.stringify(user));
    return { success: "User updated successfully !", status: 200, data: { linkOBJ } };
  } catch (error) {
    console.log(error);
    return { error: "User not updated !" };
  }
}
export async function deleteLink(id?: string) {
  try {
    const { userId } = await auth();
    await connect();
    const link = await Link.findByIdAndDelete(id);
    console.log(link);
    const updatedUser = await User.findOne({ clerkUserId: userId });
    if (!updatedUser) return { error: "User not updated !" };
    updatedUser.links = updatedUser.links.filter((link: any) => link._id != id);
    await updatedUser.save();
    if (!link) return { error: "Link  deleted !" };
    return { success: "Link updated successfully !", status: 200 };
  } catch (error) {
    console.log(error);
  }
}

export async function updateUserDetails(data: { bio?: string; userName?: string }) {
  try {
    const { userId } = await auth();
    const updateData: any = {};
    if (data.bio !== undefined) updateData.bio = data.bio;
    if (data.userName !== undefined) updateData.userName = data.userName;
    if (data.phone) updateData.phone = data.phone;
    console.log(updateData);
    const user = await User.findOneAndUpdate({ clerkUserId: userId }, updateData, { runValidators: true }).lean();
    console.log(user);
    if (!user) return { error: "User not updated!" };
    return { success: "User updated successfully!", status: 200, data: { user } };
  } catch (error) {
    return { error: "An error occurred while updating the user." };
  }
}
export async function updateFont(font: string) {
  try {
    const { userId } = await auth();
    const user = await User.findOneAndUpdate({ clerkUserId: userId }, { font: font }).lean();
    if (!user) return { error: "User not updated !" };
    return { success: "User updated successfully !", status: 200, data: { user } };
  } catch (error) {}
}
export async function updateTheme(theme: string) {
  try {
    const { userId } = await auth();
    const user = await User.findOneAndUpdate({ clerkUserId: userId }, { theme: theme }).lean();
    if (!user) return { error: "User not updated !" };
    return { success: "User updated successfully !", status: 200, data: { user } };
  } catch (error) {
    console.log(error);
  }
}
export async function deleteUser() {
  const { userId } = await auth();
  const user = await User.findOneAndDelete({ clerkUserId: userId });
  if (!user) return { error: "User not deleted !" };
  return { success: "User deleted successfully !", status: 200 };
}
export async function updateButtons(data: { border: number; color: string }) {
  try {
    console.log(data);
    const { border, color } = data;
    const { userId } = await auth();
    const user = await User.findOneAndUpdate({ clerkUserId: userId }, { buttons: { border, color } }).lean();
    if (!user) return { error: "User not updated !" };
    return { success: "User updated successfully !", status: 200, data: { user } };
  } catch (error) {
    console.log(error);
  }
}

export async function deactivateUser(id: string, value: boolean) {
  console.log(id, value);
  const user = await User.findOneAndUpdate({ clerkUserId: id }, { active: value });
  if (!user) return { error: "User not found !" };
  user.active = value;
  await user.save();
  return { success: `User ${value === true ? "activated" : "deactivated"} successfully !`, status: 200 };
}

export async function uploadProduct(data: any) {
  const product = await Product.create({
    ...data,
  });
  const productObj = JSON.parse(JSON.stringify(product));

  return { success: "Product uploaded successfully !", status: 200, data: { productObj } };
}
export async function deleteProduct(id: string) {
  const product = await Product.findOne({ _id: id });
  product.image.forEach(async (image: any) => {
    await deleteImage(image.public_id);
  });
  const productdelete = await Product.findOneAndDelete({ _id: id });
  revalidatePath("/admin/products");
  return { success: "Product deleted successfully !", status: 200, data: null };
}
export async function updateProduct(data: any, id: string) {
  try {
    console.log(data, id);
    const productnew = await Product.findOneAndUpdate(
      { _id: id },
      {
        ...data,
      }
    );
    const productObj = JSON.parse(JSON.stringify(productnew));

    return { success: "Product updated successfully !", status: 200, data: { productObj } };
  } catch (error) {
    console.log(error);
  }
}
export const deleteProductImage = async (public_id: string, productId: string) => {
  await deleteImage(public_id);
  const product = await Product.findOne({ _id: productId });
  product.image = product.image.filter((image: any) => image.public_id !== public_id);
  await product.save();
  const productObj = JSON.parse(JSON.stringify(product));
  return { success: "Image deleted successfully", status: 200, data: { productObj } };
};
export const deleteOrder = async (id: string) => {
  const order = await Order.findOneAndDelete({ _id: id });
  return { success: "Order deleted successfully !", status: 200, data: null };
};
