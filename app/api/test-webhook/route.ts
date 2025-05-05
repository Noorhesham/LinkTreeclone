import { NextResponse } from "next/server";
import { POST as webhookHandler } from "../webhooks/clerk/route";
import { cookies } from "next/headers";

// This simulates a Clerk webhook event for local testing
export async function POST(req: Request) {
  try {
    // Get the event type and data from the request
    const { eventType, userData } = await req.json();

    // Check if there's a cardId in the cookies
    const cardIdCookie = cookies().get("cardId")?.value;
    console.log("Test webhook - cardId cookie:", cardIdCookie);

    // Create a simulated webhook event based on the event type
    let mockWebhookEvent;

    if (eventType === "user.deleted") {
      // For deletion events, we only need the user ID
      mockWebhookEvent = {
        type: "user.deleted",
        data: {
          id: userData?.id || "user_" + Math.random().toString(36).substring(2),
        },
      };
      console.log("Creating mock user.deleted event with ID:", mockWebhookEvent.data.id);
    } else {
      // For other events (created/updated)
      mockWebhookEvent = {
        type: eventType || "user.created",
        data: {
          id: userData?.id || "user_" + Math.random().toString(36).substring(2),
          email_addresses: [{ email_address: userData?.email || "test@example.com" }],
          first_name: userData?.firstName || "Test",
          last_name: userData?.lastName || "User",
          image_url: userData?.imageUrl || null,
        },
      };
    }

    // Manually add the cardId to the request headers to simulate the cookie
    const headers = new Headers({
      "Content-Type": "application/json",
      "svix-id": "test-svix-id",
      "svix-timestamp": Date.now().toString(),
      "svix-signature": "test-signature",
    });

    // If there's a cardId provided in the test request, add it as a cookie
    if (userData?.cardId) {
      console.log("Adding cardId to test cookie:", userData.cardId);
      // We can't directly set cookies here, but we'll set it in the request
      // The webhook handler will use headers to extract this
      headers.set("x-card-id", userData.cardId);
    }

    // Create a new request with the proper headers
    const mockRequest = new Request("http://localhost:3000/api/webhooks/clerk", {
      method: "POST",
      headers,
      body: JSON.stringify(mockWebhookEvent),
    });

    // Forward to the webhook handler
    console.log("Sending mock webhook event:", JSON.stringify(mockWebhookEvent, null, 2));

    const response = await webhookHandler(mockRequest);
    const responseText = await response.text();

    return NextResponse.json({
      success: response.status < 400,
      message: "Test webhook processed",
      status: response.status,
      response: responseText,
      cardIdCookie: cardIdCookie || "Not found in cookies",
    });
  } catch (error) {
    console.error("Error in test webhook:", error);
    return NextResponse.json(
      {
        success: false,
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
