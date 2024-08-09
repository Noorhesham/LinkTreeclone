import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import createMiddleware from "next-intl/middleware";

const intlMiddleware = createMiddleware({
  locales: ["en", "ar"],
  localePrefix: "always",
  defaultLocale: "en",
});
const isPublicRoute = createRouteMatcher([
  "/",
  "/ar",
  "/en",
  "/sign-in",
  "/en/sign-in",
  "/en/sign-in(.*)",
  "/ar/sign-in",
  "/sign-up",
  "/en/sign-up(.*)",
  "/ar/sign-up",
  "/webhook",
  "/api/webhooks/clerk","/en/profile/([^/.])","/en/profile/(.*)",
  "/ar/profile/([^/.])","/ar/profile/(.*)","/en/store","/store"
]);
export default clerkMiddleware((auth, req) => {
  if (!isPublicRoute(req)) {
    auth().protect();
  }
  console.log(req.url);
  // Apply intlMiddleware only if the request path does not start with /api
  if (!req.url.includes("/api")) {
    return intlMiddleware(req);
  }
});

export const config = {
  matcher: [
    "/((?!.*\\..*|_next).*)",
    "/",
    "/(api|trpc)(.*)", // Ensure this includes /api/webhooks/clerk
  ],
};
/*
upload product as admin
active state for users 
animation for nfc
show products 
allow users to send purchase requests 
show purchase requests to fathy boi
 */