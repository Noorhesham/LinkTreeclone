"use server";

import { revalidatePath } from "next/cache";
import CardId from "@/app/lib/models/Ids";
import User from "@/app/lib/models/userModel";
import connect from "../db";

// Get all card IDs
export async function getCardIds() {
  try {
    await connect();
    const cardIds = await CardId.find().sort({ createdAt: -1 }).populate("assignedTo");
    console.log(cardIds, "cardIds");
    return JSON.parse(JSON.stringify(cardIds));
  } catch (error) {
    console.error("Error getting card IDs:", error);
    throw new Error("Failed to fetch card IDs");
  }
}

// Generate a new card ID
export async function generateCardId(description: string) {
  try {
    await connect();
    await CardId.createCardId(description);
    revalidatePath("/admin/card-ids");
    return { success: true };
  } catch (error) {
    console.error("Error generating card ID:", error);
    throw new Error("Failed to generate card ID");
  }
}

// Associate a card ID with a user
export async function associateCardIdWithUser(cardIdString: string, userId: string) {
  try {
    await connect();

    // Find the card ID
    const cardId = await CardId.findOne({ cardId: cardIdString });

    if (!cardId) {
      throw new Error("Card ID not found");
    }

    if (cardId.isAssigned) {
      throw new Error("Card ID is already assigned to a user");
    }

    // Find the user
    const user = await User.findOne({ clerkUserId: userId });

    if (!user) {
      throw new Error("User not found");
    }

    // Associate the card ID with the user
    cardId.isAssigned = true;
    cardId.assignedTo = user._id;
    await cardId.save();

    // Update the user with the card ID
    user.associatedCardId = cardId._id;
    await user.save();

    return { success: true };
  } catch (error) {
    console.error("Error associating card ID with user:", error);
    throw new Error("Failed to associate card ID with user");
  }
}

// Get users by card ID
export async function getUserByCardId(cardIdString: string) {
  try {
    await connect();

    // Find the card ID
    const cardId = await CardId.findOne({ cardId: cardIdString });

    if (!cardId) {
      return null;
    }

    // Find the user associated with this card ID
    const user = await User.findOne({ associatedCardId: cardId._id });

    return user ? JSON.parse(JSON.stringify(user)) : null;
  } catch (error) {
    console.error("Error getting user by card ID:", error);
    throw new Error("Failed to get user by card ID");
  }
}
