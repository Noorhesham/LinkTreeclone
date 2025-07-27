"use client";

import { SignUp } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useClerk } from "@clerk/nextjs";

export default function SignUpWrapper() {
  const searchParams = useSearchParams();
  const cardId = searchParams.get("cardId");
  const [redirectUrl, setRedirectUrl] = useState("/");

  useEffect(() => {
    // Set the cookie if cardId exists
    if (cardId) {
      document.cookie = `cardId=${cardId}; path=/; max-age=3600`;
      console.log("CardID cookie set:", cardId);
    }

    // Set the redirect URL (only runs in browser)
    const baseUrl = window.location.origin;
    setRedirectUrl(cardId ? `${baseUrl}/profile?cardId=${cardId}` : baseUrl);
  }, [cardId]);

  return <SignUp signInUrl="/sign-in" redirectUrl={redirectUrl} afterSignUpUrl={redirectUrl} />;
}
