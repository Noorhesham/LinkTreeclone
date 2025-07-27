"use client";

import { SignUp } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { redirect, useRouter } from "next/navigation";
import { updateUserDetails } from "@/app/linkActions/actions";

export default function SignUpWrapper() {
  const { isLoaded, isSignedIn, userId } = useAuth();
  const { user } = useUser();
  const searchParams = useSearchParams();
  const router = useRouter();
  const cardId = searchParams.get("cardId");
  const [redirectUrl, setRedirectUrl] = useState<string | undefined>(undefined);
  const [isClient, setIsClient] = useState(false);
  const [isProcessingCardId, setIsProcessingCardId] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // Set the cookie if cardId exists
    if (cardId) {
      document.cookie = `cardId=${cardId}; path=/; max-age=3600`;
      console.log("CardID cookie set:", cardId);
    }

    // Set the redirect URL (only runs in browser)
    const baseUrl = window.location.origin;
    setRedirectUrl(cardId ? `${baseUrl}/profile?cardId=${cardId}` : baseUrl);
  }, [cardId]);

  // Handle already signed-in users
  useEffect(() => {
    if (isLoaded && isSignedIn && userId && user) {
      console.log("User is already signed in, processing cardId if present");

      if (cardId && !isProcessingCardId) {
        setIsProcessingCardId(true);

        // Link the cardId to the existing user
        updateUserDetails({ cardId: cardId.toString() })
          .then((result) => {
            if (result.success) {
              console.log("Successfully linked cardId to existing user");
              // Redirect to profile with cardId to trigger the profile lookup
              router.push(`/profile?cardId=${cardId}`);
            } else {
              console.error("Failed to link cardId to user:", result.error);
              // Still redirect to profile even if linking failed
              router.push("/profile");
            }
          })
          .catch((err) => {
            console.error("Error linking cardId:", err);
            router.push("/profile");
          });
      } else {
        // No cardId, just redirect to profile
        router.push("/profile");
      }
    }
  }, [isLoaded, isSignedIn, userId, user, cardId, router, isProcessingCardId]);

  // Show loading state while checking auth or processing cardId
  if (!isClient || !isLoaded || (isSignedIn && cardId && isProcessingCardId)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          {isSignedIn && cardId && <p className="text-sm text-gray-400">Linking card to your account...</p>}
        </div>
      </div>
    );
  }

  // If user is signed in (and we're not processing cardId), they shouldn't see signup
  if (isSignedIn) {
    return null; // This case should be handled by the useEffect redirect above
  }

  // Show signup form for non-authenticated users
  return <SignUp signInUrl="/sign-in" redirectUrl={redirectUrl} afterSignUpUrl={redirectUrl} />;
}
