import { Webhook } from "svix";
import { cookies, headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { createUser, updateUser } from "@/app/lib/actions/actions";
import { deleteUser } from "@/app/linkActions/actions";
import connect from "@/app/lib/db"; // Import the DB connection
import User from "@/app/lib/models/userModel"; // Correct path to User model

// Define user data interface to fix type issues
interface UserData {
  clerkUserId: string;
  email: string;
  userName: string;
  firstName?: string;
  lastName?: string;
  photo?: string;
  cardId?: string;
}

// Add a route for GET requests to check if the webhook endpoint is reachable
export async function GET() {
  return new Response("Webhook endpoint is operational", { status: 200 });
}

// Helper function to handle webhook events
async function handleWebhookEvent(evt: WebhookEvent, customCardId?: string) {
  const eventType = evt.type;
  console.log(`🔔 Processing ${eventType} event`);

  // Ensure DB connection first
  try {
    await connect();
    console.log("✅ DB connection successful in webhook");
  } catch (dbError) {
    console.error("❌ DB connection failed in webhook:", dbError);
    throw new Error("Database connection failed");
  }

  // USER CREATED OR UPDATED EVENTS
  if (eventType === "user.created" || eventType === "user.updated") {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data;

    console.log("User data from webhook:", {
      id,
      email: email_addresses?.[0]?.email_address,
      first_name,
      last_name,
    });

    // We need to create a minimal valid user object to avoid schema validation issues
    if (!id || !email_addresses || !email_addresses[0]?.email_address) {
      console.error("❌ Missing critical user data (id or email)");
      throw new Error("Missing required user data");
    }

    // Get cardId from cookie only if we don't have a direct value from test
    let cardId = customCardId;

    if (!cardId) {
      // Get cardId from cookie and log for debugging
      const cardIdCookie = cookies().get("cardId")?.value;
      console.log("⭐ Card ID from cookie:", cardIdCookie);

      // Get cardId from referer header
      let cardIdFromHeader = null;
      const headerPayload = headers();

      // Try to get cardId from x-card-id header (for testing)
      let cardIdFromTestHeader = headerPayload.get("x-card-id");
      if (cardIdFromTestHeader) {
        console.log("⭐ Card ID from x-card-id header:", cardIdFromTestHeader);
      }

      const referer = headerPayload.get("referer");
      if (referer) {
        try {
          const url = new URL(referer);
          cardIdFromHeader = url.searchParams.get("cardId");
          console.log("⭐ Card ID from referer header:", cardIdFromHeader);
        } catch (urlError) {
          console.error("Error parsing referer URL:", urlError);
        }
      }

      // Use cardId from any source, with explicit logging
      cardId = cardIdFromTestHeader || cardIdFromHeader || cardIdCookie;
    }

    console.log("⭐ Final card ID to use:", cardId);

    // Check if user already exists before trying to create
    const existingUser = await User.findOne({ email: email_addresses[0].email_address });
    if (existingUser && eventType === "user.created") {
      console.log("⚠️ User already exists in database, updating instead of creating");

      // Create the minimal user data for update
      const userData: UserData = {
        clerkUserId: id,
        email: email_addresses[0].email_address,
        userName: existingUser.userName,
      };

      // Only add optional fields if they exist
      if (first_name) userData.firstName = first_name;
      if (last_name) userData.lastName = last_name;
      if (image_url) userData.photo = image_url;
      if (cardId) userData.cardId = cardId;

      const updateResult = await updateUser(userData, id);
      console.log("✅ User updated instead of created:", updateResult);
      return "User updated successfully";
    }

    // Create the simplest possible user object that meets schema requirements
    const minimalUserData: UserData = {
      clerkUserId: id,
      email: email_addresses[0].email_address,
      // Generate a random username since it's required
      userName: `user_${Math.random().toString(36).substring(2, 10)}`,
    };

    // Only add optional fields if they exist
    if (first_name) minimalUserData.firstName = first_name;
    if (last_name) minimalUserData.lastName = last_name;
    if (image_url) minimalUserData.photo = image_url;
    if (cardId) minimalUserData.cardId = cardId;

    console.log(`🚀 User object for database:`, JSON.stringify(minimalUserData));

    // Try creating/updating the user
    if (eventType === "user.created") {
      console.log("⏳ Calling createUser function...");
      try {
        const result = await createUser(minimalUserData);
        console.log("✅ User created successfully:", result);
        return "User created successfully";
      } catch (createError: any) {
        console.error("❌ createUser function error:", createError);
        // Try again with just the essential fields if something failed
        if (createError.message?.includes("duplicate key") || createError.message?.includes("already exists")) {
          console.log("Attempting to recover from duplicate key error...");
          // Try a different username
          minimalUserData.userName = `user_${Date.now().toString(36)}`;
          try {
            const retryResult = await createUser(minimalUserData);
            console.log("✅ User created on retry:", retryResult);
            return "User created on retry";
          } catch (retryError: any) {
            console.error("❌ Failed on retry too:", retryError);
            // If we still fail, try to update instead
            if (retryError.message?.includes("already exists")) {
              console.log("Attempting to update existing user instead");
              const updateResult = await updateUser(minimalUserData, id);
              console.log("✅ User updated as fallback:", updateResult);
              return "User updated as fallback";
            } else {
              throw retryError;
            }
          }
        } else {
          throw createError; // Re-throw if it's not a duplicate key issue
        }
      }
    } else if (eventType === "user.updated") {
      console.log("⏳ Calling updateUser function...");
      const result = await updateUser(minimalUserData, id);
      console.log("✅ User updated successfully:", result);
      return "User updated successfully";
    }
  }
  // USER DELETED EVENT
  else if (eventType === "user.deleted") {
    try {
      const { id } = evt.data;

      if (!id) {
        console.error("❌ Missing user ID in user.deleted event");
        throw new Error("Missing user ID in deletion event");
      }

      console.log(`🗑️ Processing user deletion for Clerk ID: ${id}`);

      // First check if the user exists in our database
      const existingUser = await User.findOne({ clerkUserId: id });
      if (!existingUser) {
        console.log("⚠️ User not found in database during deletion, may have been deleted already");
        return "User already deleted or not found";
      }

      console.log(`Found user to delete: ${existingUser.email} (${existingUser._id})`);

      // Pass the Clerk user ID to the deleteUser function
      const result = await deleteUser(id);
      console.log("🗑️ User deletion result:", result);

      if (result.error) {
        throw new Error(result.error);
      }

      return "User deleted successfully";
    } catch (deleteError: any) {
      console.error("❌ Error processing user.deleted event:", deleteError);
      throw deleteError;
    }
  }
  // ANY OTHER EVENT TYPES
  else {
    console.log("⏭️ Ignoring event type:", eventType);
    return `Ignored event: ${eventType}`;
  }
}

// Helper function to check if we're in development mode
function isDevMode() {
  return process.env.NODE_ENV === "development" || process.env.BYPASS_WEBHOOK_VERIFICATION === "true";
}

export async function POST(req: Request) {
  // Log the raw request URL and method for debugging
  console.log(`====================== WEBHOOK ${req.method} REQUEST RECEIVED: ${req.url} ======================`);
  console.log(`✅ NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`✅ BYPASS_WEBHOOK_VERIFICATION: ${process.env.BYPASS_WEBHOOK_VERIFICATION}`);
  console.log(`✅ Development mode: ${isDevMode() ? "YES" : "NO"}`);

  // For development mode - bypass signature verification
  if (isDevMode()) {
    console.log("⚠️ DEVELOPMENT MODE: Bypassing webhook signature verification");
    try {
      const payload = await req.json();

      // Extract cardId from the headers if available (for testing)
      const testCardId = headers().get("x-card-id") || undefined;
      if (testCardId) {
        console.log("💳 Using test cardId:", testCardId);
      }

      const result = await handleWebhookEvent(payload, testCardId);
      return new Response(result, { status: 200 });
    } catch (error) {
      console.error("Error in webhook (dev mode):", error);
      return new Response(`Webhook Error: ${(error as Error).message}`, { status: 400 });
    }
  }

  // Get the Svix headers for verification
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!WEBHOOK_SECRET) {
    console.error("❌ CLERK_WEBHOOK_SECRET is not set in environment variables");
    return new Response("Webhook secret is not set", { status: 500 });
  }

  console.log("Svix headers:", {
    "svix-id": svix_id,
    "svix-timestamp": svix_timestamp,
    "svix-signature": svix_signature?.substring(0, 10) + "...", // Only log part of the signature
  });

  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error("❌ Missing svix headers - this might not be a valid Clerk webhook call");
    return new Response("Error occurred -- no svix headers", { status: 400 });
  }

  // Read and log the raw request body
  let rawBody: string;
  try {
    // Clone the request so we can read the body twice
    const clonedReq = req.clone();
    rawBody = await clonedReq.text();
    console.log("📝 Raw webhook body length:", rawBody.length);
    console.log("📝 First 200 characters of body:", rawBody.substring(0, 200));
  } catch (bodyError) {
    console.error("❌ Error reading raw request body:", bodyError);
    return new Response("Error reading request body", { status: 400 });
  }

  // Parse the JSON payload
  let payload;
  try {
    payload = JSON.parse(rawBody);
    console.log("✅ Parsed JSON payload");
  } catch (jsonError) {
    console.error("❌ Error parsing JSON:", jsonError);
    return new Response("Invalid JSON", { status: 400 });
  }

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    // Verify the webhook with Svix
    evt = wh.verify(rawBody, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
    console.log("✅ Webhook verification successful");
  } catch (err) {
    console.error("❌ Error verifying webhook:", err);
    return new Response("Error verifying webhook signature", { status: 400 });
  }

  try {
    const result = await handleWebhookEvent(evt);
    console.log("==================== WEBHOOK COMPLETED ====================");
    return new Response(result, { status: 200 });
  } catch (error) {
    console.error("❌ Error processing webhook:", error);
    return new Response(`Error processing webhook: ${(error as Error).message}`, { status: 500 });
  }
}
