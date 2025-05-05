import { Webhook } from "svix";
import { cookies, headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { createUser, updateUser } from "@/app/lib/actions/actions";
import { deleteUser } from "@/app/linkActions/actions";
import connect from "@/app/lib/db"; // Import the DB connection

// Add a route for GET requests to check if the webhook endpoint is reachable
export async function GET() {
  return new Response("Webhook endpoint is operational", { status: 200 });
}

export async function POST(req: Request) {
  // Log the raw request URL and method for debugging
  console.log(`====================== WEBHOOK ${req.method} REQUEST RECEIVED: ${req.url} ======================`);

  try {
    // First, ensure DB connection
    await connect();
    console.log("✅ DB connection successful in webhook");
  } catch (dbError) {
    console.error("❌ DB connection failed in webhook:", dbError);
    return new Response("Database connection failed", { status: 500 });
  }

  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("❌ CLERK_WEBHOOK_SECRET is not set in environment variables");
    return new Response("Webhook secret is not set", {
      status: 500,
    });
  }

  // Log all headers for debugging
  const headerPayload = headers();
  console.log("🔍 All request headers:");

  // Get the Svix headers for verification
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  console.log("Svix headers:", {
    "svix-id": svix_id,
    "svix-timestamp": svix_timestamp,
    "svix-signature": svix_signature?.substring(0, 10) + "...", // Only log part of the signature
  });

  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error("❌ Missing svix headers - this might not be a valid Clerk webhook call");
    return new Response("Error occurred -- no svix headers", {
      status: 400,
    });
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
    return new Response("Error verifying webhook signature", {
      status: 400,
    });
  }

  const eventType = evt.type;
  console.log("🔔 Webhook event type:", eventType);

  if (eventType === "user.created" || eventType === "user.updated") {
    console.log(`🔔 Processing ${eventType} event`);
    try {
      const { id, email_addresses, first_name, last_name, image_url } = evt.data;

      console.log("User data from webhook:", {
        id,
        email: email_addresses?.[0]?.email_address,
        first_name,
        last_name,
      });

      // Get cardId from cookie
      const cardIdCookie = cookies().get("cardId")?.value;
      console.log("Card ID from cookie:", cardIdCookie);

      // Get cardId from referer header
      let cardIdFromHeader = null;
      const referer = headerPayload.get("referer");
      if (referer) {
        try {
          const url = new URL(referer);
          cardIdFromHeader = url.searchParams.get("cardId");
          console.log("Card ID from referer header:", cardIdFromHeader);
        } catch (urlError) {
          console.error("Error parsing referer URL:", urlError);
        }
      }

      // Use cardId from either source
      const cardId = cardIdFromHeader || cardIdCookie;
      console.log("Final card ID to use:", cardId);

      if (!id || !email_addresses) {
        console.error("❌ Missing required user data");
        return new Response("Error occurred -- missing data", {
          status: 400,
        });
      }

      const user = {
        clerkUserId: id,
        email: email_addresses[0].email_address,
        ...(first_name ? { firstName: first_name } : {}),
        ...(last_name ? { lastName: last_name } : {}),
        ...(image_url ? { photo: image_url } : {}),
        ...(cardId ? { cardId } : {}),
      };

      console.log(`🚀 User object to be sent to database:`, JSON.stringify(user));

      // Try creating/updating the user
      if (eventType === "user.created") {
        console.log("⏳ Calling createUser function...");
        const result = await createUser(user);
        console.log("✅ User created successfully:", result);
      } else if (eventType === "user.updated") {
        console.log("⏳ Calling updateUser function...");
        const result = await updateUser(user, id);
        console.log("✅ User updated successfully:", result);
      }
    } catch (processingError: any) {
      console.error(`❌ Error processing ${eventType} event:`, processingError);
      return new Response(`Error processing webhook: ${processingError.message || "Unknown error"}`, {
        status: 500,
      });
    }
  } else if (eventType === "user.deleted") {
    try {
      const { id } = evt.data;
      if (id) {
        deleteUser();
        console.log("✅ User deleted successfully");
      }
    } catch (deleteError) {
      console.error("❌ Error processing user.deleted event:", deleteError);
    }
  } else {
    console.log("⏭️ Ignoring event type:", eventType);
  }

  console.log("==================== WEBHOOK COMPLETED ====================");
  return new Response("Webhook processed", { status: 200 });
}
