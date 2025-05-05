import mongoose, { Schema, Document, Model } from "mongoose";
import crypto from "crypto";

// Define the interface for the document
interface ICardId extends Document {
  cardId: string;
  description?: string;
  isAssigned: boolean;
  assignedTo?: mongoose.Types.ObjectId;
  createdAt: Date;
}

// Define the interface for the model with static methods
interface ICardIdModel extends Model<ICardId> {
  generateUniqueId(length?: number): Promise<string>;
  createCardId(description?: string): Promise<ICardId>;
  getAvailableIds(): Promise<ICardId[]>;
}

const IdSchema = new Schema({
  cardId: {
    type: String,
    unique: true,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  isAssigned: {
    type: Boolean,
    default: false,
  },
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Function to generate a unique card ID
IdSchema.statics.generateUniqueId = async function (length = 8): Promise<string> {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let isUnique = false;
  let cardId = "";

  while (!isUnique) {
    // Generate random ID
    cardId = Array.from(crypto.randomBytes(length), (byte) => characters[byte % characters.length]).join("");

    // Check if ID already exists
    const existingId = await this.findOne({ cardId });
    if (!existingId) {
      isUnique = true;
    }
  }

  return cardId;
};

// Create a new card ID record
IdSchema.statics.createCardId = async function (description = ""): Promise<ICardId> {
  const cardId = await (this as ICardIdModel).generateUniqueId();
  return this.create({
    cardId,
    description,
    isAssigned: false,
  });
};

// Get available card IDs
IdSchema.statics.getAvailableIds = function (): Promise<ICardId[]> {
  return this.find({ isAssigned: false });
};

// Create and export the model
const CardId: ICardIdModel =
  (mongoose.models.CardId as ICardIdModel) || mongoose.model<ICardId, ICardIdModel>("CardId", IdSchema);

export default CardId;
