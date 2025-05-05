import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";

const intlMiddleware = createMiddleware({
  locales: ["en", "ar"],
  localePrefix: "always",
  defaultLocale: "en",
});

// Define public routes that don't need authentication
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
  "/api/webhooks/clerk",
  "/en/profile/([^/.])",
  "/en/profile/(.*)",
  "/ar/profile/([^/.])",
  "/ar/profile/(.*)",
  "/en/store",
  "/store",
]);

// Define admin routes that need special protection
const isAdminRoute = createRouteMatcher(["/admin(.*)", "/en/admin(.*)", "/ar/admin(.*)"]);

// List of admin emails - adjust as needed
const ADMIN_EMAILS = ["admin@example.com"]; // Replace with actual admin emails

export default clerkMiddleware((auth, req) => {
  // Get auth state first
  const { userId } = auth();

  // Special handling for admin routes
  if (isAdminRoute(req)) {
    // Not authenticated - redirect to sign in
    if (!userId) {
      console.log("Unauthenticated user trying to access admin route");
      return auth().redirectToSignIn({ returnBackUrl: req.url });
    }

    // Check if user is admin (can be enhanced with role check)
    // For now we'll just let authenticated users access admin routes
    // In production, implement proper role checks here
  }

  // Handle non-public routes
  if (!isPublicRoute(req) && !req.url.includes("/api")) {
    if (!userId) {
      console.log("Protecting non-public route");
      return auth().redirectToSignIn({ returnBackUrl: req.url });
    }
  }

  // Apply intl middleware for locale handling
  if (!req.url.includes("/api")) {
    return intlMiddleware(req);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
/*
upload product as admin
active state for users 
animation for nfc
show products 
allow users to send purchase requests 
show purchase requests to fathy boi
 */
