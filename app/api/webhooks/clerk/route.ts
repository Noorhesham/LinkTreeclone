import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { createUser, updateUser } from "@/app/lib/actions/actions"; // Assuming you have an updateUser function
import { deleteUser } from "@/app/linkActions/actions";

export async function POST(req: Request) {
  console.log("Webhook POST request received");

  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("CLERK_WEBHOOK_SECRET is not set");
    return new Response("Webhook secret is not set", {
      status: 500,
    });
  }

  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  console.log("Headers received:", { svix_id, svix_timestamp, svix_signature });

  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error("Missing svix headers");
    return new Response("Error occurred -- no svix headers", {
      status: 400,
    });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occurred", {
      status: 400,
    });
  }

  console.log("Webhook event received:", evt);

  const eventType = evt.type;
  console.log("Webhook event type:", eventType);

  if (eventType === "user.created" || eventType === "user.updated") {
    console.log(`Processing ${eventType} event`);
    const { id, email_addresses, first_name, last_name, image_url } = evt.data;

    if (!id || !email_addresses) {
      console.error("Missing data in webhook event");
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
    };

    console.log(`${eventType === "user.created" ? "Creating" : "Updating"} user with data:`, user);

    try {
      if (eventType === "user.created") {
        await createUser(user);
        console.log("User created successfully");
      } else if (eventType === "user.updated") {
        await updateUser(user, id);
        console.log("User updated successfully");
      } else if (eventType === "user.deleted") {
        deleteUser();
      }
    } catch (error) {
      console.error(`Error ${eventType === "user.created" ? "creating" : "updating"} user:`, error);
      return new Response(`Error ${eventType === "user.created" ? "creating" : "updating"} user`, {
        status: 500,
      });
    }
  } else {
    console.log("Ignoring event type:", eventType);
  }

  return new Response("Webhook processed", { status: 200 });
}
