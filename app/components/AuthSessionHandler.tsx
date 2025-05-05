"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function AuthSessionHandler() {
  const { getToken, isSignedIn, isLoaded } = useAuth();
  const [tokenRefreshing, setTokenRefreshing] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Refresh token on mount and on pathname change
  useEffect(() => {
    // If not in an auth page path, refresh token
    if (isLoaded && isSignedIn && !pathname.includes("/sign-in") && !pathname.includes("/sign-up")) {
      const refreshToken = async () => {
        setTokenRefreshing(true);
        try {
          // Request a fresh token
          await getToken({ skipCache: true });
          console.log("Auth token refreshed");
        } catch (error) {
          console.error("Token refresh error:", error);
          // If there's an error refreshing, redirect to sign-in
          if (error.message?.includes("token-expired")) {
            router.push("/sign-in");
          }
        } finally {
          setTokenRefreshing(false);
        }
      };

      refreshToken();
    }
  }, [pathname, isLoaded, isSignedIn, getToken, router]);

  return null; // This component doesn't render anything
}
