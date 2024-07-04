"use server";

import { auth } from "@clerk/nextjs/server";
import connect from "../lib/db";
import Link from "../lib/models/linkModel";
import User from "../lib/models/userModel";

export async function addLink(data: { link: string; provider: string }, userId: string) {
  console.log(data, userId);
  await connect();
  const link = await Link.create({
    link: data.link,
    provider: data.provider,
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
    return { success: "User updated successfully !", status: 200, data: { user } };
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

export async function updateUserDetails(data: { bio?: string; userName?: string }, id?: string) {
  try {
    const updateData: any = {};
    if (data.bio !== undefined) updateData.bio = data.bio;
    if (data.userName !== undefined) updateData.userName = data.userName;

    const user = await User.findByIdAndUpdate(id, updateData).lean();
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