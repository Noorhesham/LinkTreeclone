import { NextResponse } from "next/server";
import { POST as webhookHandler } from "../webhooks/clerk/route";

// This simulates a Clerk webhook event for local testing
export async function POST(req: Request) {
  try {
    // Get the event type and data from the request
    const { eventType, userData } = await req.json();

    // Create a simulated webhook event
    const mockWebhookEvent = {
      type: eventType || "user.created",
      data: {
        id: userData?.id || "user_" + Math.random().toString(36).substring(2),
        email_addresses: [{ email_address: userData?.email || "test@example.com" }],
        first_name: userData?.firstName || "Test",
        last_name: userData?.lastName || "User",
        image_url: userData?.imageUrl || null,
      },
    };

    // Create a new request with the proper Svix headers
    // Note: This won't pass signature verification, you'll need to modify the webhook handler
    // for local testing to bypass verification or implement proper signing
    const mockRequest = new Request("http://localhost:3000/api/webhooks/clerk", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "svix-id": "test-svix-id",
        "svix-timestamp": Date.now().toString(),
        "svix-signature": "test-signature",
      },
      body: JSON.stringify(mockWebhookEvent),
    });

    // Forward to the webhook handler
    console.log("Sending mock webhook event:", JSON.stringify(mockWebhookEvent, null, 2));

    // For local testing, you should temporarily modify the webhook handler
    // to bypass signature verification in development environment
    const response = await webhookHandler(mockRequest);

    return NextResponse.json({
      success: true,
      message: "Test webhook sent",
      status: response.status,
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
