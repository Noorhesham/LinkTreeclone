"use server";

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

  console.log(link);
  if (!link) return { error: "Link not added !" };
  const linkOBJ = JSON.parse(JSON.stringify(link));
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
export async function deleteLink(id?: string) {
  try {
    console.log(id);
    await connect();
    const link = await Link.findByIdAndDelete(id);
    console.log(link);
    if (!link) return { error: "Link  deleted !" };
    return { success: "Link updated successfully !", status: 200 };
  } catch (error) {
    console.log(error);
  }
}

export async function updateBio(data: { bio: string; _id: string }, id?: string) {
  try {
    const user = await User.findByIdAndUpdate(id, { bio: data.bio });
    if (!user) return { error: "User not updated !" };
    return { success: "User updated successfully !", status: 200, data: { user } };
  } catch (error) {}
}
