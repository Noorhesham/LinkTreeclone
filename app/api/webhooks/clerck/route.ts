import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { WebhookEvent } from "@clerk/nextjs/server";
import {Webhook} from 'svix'
import { headers } from "next/headers";
 
// export async function POST() {
//   const webhook = new Webhook(process.env.WEBHOOK_SECRET as string);
//   const headersList = headers();
//   const signature = headersList.get("svix-signature");
//   const body = headersList.get("svix-event-type");
//   const secret = headersList.get("svix-secret");

//   if (!signature || !body || !secret) {
//     return new Response("Bad request", { status: 400 });
//   }

//   const event: WebhookEvent = JSON.parse(body);

//   if (secret !== process.env.WEBHOOK_SECRET) {

//     return new Response("Bad request", { status: 400 });
//   }

//   if (!event) {
