"use server";

import { auth } from "@clerk/nextjs/server";
import connect from "../lib/db";
import Link from "../lib/models/linkModel";
import User from "../lib/models/userModel";
import Product from "../lib/models/ProductModel";
import { deleteImage } from "../lib/actions/actions";
import { revalidatePath } from "next/cache";
import Order from "../lib/models/Order";
import mongoose from "mongoose";

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

export async function updateUserDetails(data: {
  bio?: string;
  userName?: string;
  cardId?: string;
  phone?: string;
  phone2?: string;
}) {
  try {
    const { userId } = await auth();
    const updateData: any = {};
    if (data.bio !== undefined) updateData.bio = data.bio;
    if (data.userName !== undefined) {
      updateData.userName = data.userName;
      updateData.hasCustomUsername = true; // Mark that user has customized their username
    }
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.phone2 !== undefined) updateData.phone2 = data.phone2;
    console.log(updateData, "data");
    console.log(data.cardId, "data.cardId");
    // Handle cardId updates specially
    if (data.cardId) {
      console.log("Updating user with cardId:", data.cardId);
      updateData.cardId = data.cardId;

      // If we're using the CardId model, mark it as assigned
      await connect();
      try {
        const CardId = mongoose.models.CardId || (await import("../lib/models/Ids").then((m) => m.default));
        if (CardId) {
          // Find the cardId in the CardId collection
          const cardIdRecord = await CardId.findOne({ cardId: data.cardId });
          if (cardIdRecord) {
            // Mark as assigned and link to this user
            cardIdRecord.isAssigned = true;
            cardIdRecord.assignedTo = (await User.findOne({ clerkUserId: userId }))?._id;
            await cardIdRecord.save();
            console.log("CardId marked as assigned:", data.cardId);
          } else {
            console.log("CardId not found in CardId collection, creating new record");
            // Create a new record if it doesn't exist
            await CardId.create({
              cardId: data.cardId,
              isAssigned: true,
              assignedTo: (await User.findOne({ clerkUserId: userId }))?._id,
              description: "Assigned via user update",
            });
          }
        }
      } catch (cardIdError) {
        console.error("Error updating CardId model:", cardIdError);
        // Continue with user update even if CardId update fails
      }
    }

    console.log("Updating user with data:", updateData);
    console.log("Looking for user with clerkUserId:", userId);

    // First find the user to get their MongoDB _id
    const existingUser = await User.findOne({ clerkUserId: userId }).lean();
    console.log("Existing user found:", existingUser ? "Yes" : "No");
    if (!existingUser) {
      console.error("User not found with clerkUserId:", userId);
      return { error: "User not found!" };
    }

    // Check if user is trying to change username but has already customized it
    if (data.userName !== undefined && (existingUser as any).hasCustomUsername) {
      console.log("User already has a custom username, preventing change");
      return { error: "Username can only be changed once!" };
    }

    const mongoId = (existingUser as any)._id;
    console.log("Found user MongoDB ID:", mongoId);
    console.log("Existing user details:", {
      _id: mongoId,
      userName: (existingUser as any).userName,
      email: (existingUser as any).email,
    });

    // Now update using the MongoDB _id instead of clerkUserId
    const user = await User.findByIdAndUpdate(mongoId, updateData, {
      new: true,
      runValidators: true,
    }).lean();
    console.log("User update result:", user);
    if (!user) return { error: "User not updated!" };
    return { success: "User updated successfully!", status: 200, data: { user } };
  } catch (error) {
    console.error("Error in updateUserDetails:", error);
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
export async function deleteUser(clerkUserId?: string) {
  try {
    console.log("Deleting user with clerk ID:", clerkUserId);

    let userId = clerkUserId;
    if (!userId) {
      const authResult = await auth();
      // Fix type error by using type assertion or conditional check
      userId = authResult?.userId || undefined;
    }

    console.log("Final userId for deletion:", userId);

    if (!userId) {
      console.error("No user ID provided for deletion");
      return { error: "No user ID provided" };
    }

    await connect();

    // Find the user first to get their ID and associated data
    const user = await User.findOne({ clerkUserId: userId });
    if (!user) {
      console.error("User not found with clerkUserId:", userId);
      return { error: "User not found" };
    }

    console.log("Found user to delete:", user._id);

    // Delete any associated links
    if (user.links && user.links.length > 0) {
      console.log("Deleting associated links:", user.links);
      await Link.deleteMany({ _id: { $in: user.links } });
    }

    // Finally delete the user
    const deletedUser = await User.findByIdAndDelete(user._id);
    if (!deletedUser) {
      console.error("Failed to delete user");
      return { error: "User deletion failed" };
    }

    console.log("User successfully deleted");
    return { success: "User deleted successfully!", status: 200 };
  } catch (error) {
    console.error("Error in deleteUser function:", error);
    return { error: `Deletion failed: ${(error as Error).message}` };
  }
}

export async function deleteUsers(userIds: string[]) {
  try {
    console.log("Deleting users with MongoDB IDs:", userIds);

    if (!userIds || userIds.length === 0) {
      console.error("No user IDs provided for deletion");
      return { error: "No user IDs provided" };
    }

    await connect();

    // Find all users first to get their associated data
    const users = await User.find({ _id: { $in: userIds } });
    if (users.length === 0) {
      console.error("No users found with the provided IDs");
      return { error: "No users found" };
    }

    console.log(`Found ${users.length} users to delete`);

    // Collect all link IDs from all users
    const allLinkIds = users.reduce((acc: any[], user: any) => {
      if (user.links && user.links.length > 0) {
        acc.push(...user.links);
      }
      return acc;
    }, []);

    // Delete all associated links
    if (allLinkIds.length > 0) {
      console.log(`Deleting ${allLinkIds.length} associated links`);
      await Link.deleteMany({ _id: { $in: allLinkIds } });
    }

    // Delete all users
    const deletionResult = await User.deleteMany({ _id: { $in: userIds } });

    console.log(`Successfully deleted ${deletionResult.deletedCount} users`);
    return { success: `${deletionResult.deletedCount} users deleted successfully!`, status: 200 };
  } catch (error) {
    console.error("Error in deleteUsers function:", error);
    return { error: `Bulk deletion failed: ${(error as Error).message}` };
  }
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
