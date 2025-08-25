import React from "react";
import { redirect } from "next/navigation";
import { getUserByCardId } from "@/app/lib/actions/actions";
import connect from "@/app/lib/db";
import User from "@/app/lib/models/userModel";

export default async function ProfilePage({
  params,
  searchParams,
}: {
  params: { username?: string };
  searchParams: { cardId?: string; userName?: string; username?: string };
}) {
  if (true) return <div></div>;

  // Support both userName (camelCase) and username (lowercase) formats
  const { cardId } = searchParams;
  // Prioritize userName if both are provided, otherwise use username
  const userName = searchParams.userName || searchParams.username;
  const pathUserName = params.username;

  console.log("Search params:", searchParams);
  console.log("Username from params:", userName);

  // First priority: Check for cardId in route segment
  const routeCardId = pathUserName && /^[A-Z0-9]{8,}$/.test(pathUserName) ? pathUserName : null;

  // Which cardId to use - from params or search query
  const cardIdToUse = routeCardId || cardId;

  // If we have a cardId, try to find user by it
  if (cardIdToUse) {
    console.log("Searching for user by cardId:", cardIdToUse);
    const result = await getUserByCardId(cardIdToUse);

    if (!result.error && result.data?.user) {
      // We found a user with this cardId, redirect to their profile
      const foundUserName = result.data.user.userName;
      if (foundUserName) {
        redirect(`/profile/${foundUserName}`);
      } else {
        // Found user but no username
        return (
          <div className="flex min-h-screen flex-col items-center justify-center gap-4 py-24">
            <h1 className="text-3xl font-bold">User Found</h1>
            <p className="text-muted-foreground">
              A user was found with the card ID: <strong>{cardIdToUse}</strong>
            </p>
            <p className="text-muted-foreground">However, they do not have a username set.</p>
            <a
              href="/profile"
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors"
            >
              Try Another Search
            </a>
          </div>
        );
      }
    }

    // No user found with cardId, try userName next if provided
    console.log("No user found with cardId, checking userName");
  }

  // Second priority: Check for userName in search params
  if (userName) {
    console.log("Searching for user by userName:", userName);
    await connect();
    const user = await User.findOne({
      $or: [
        { userName: userName },
        { userName: { $regex: new RegExp("^" + userName + "$", "i") } }, // Case insensitive match
      ],
    }).lean();
    console.log("User found by username:", user);

    if (user) {
      // Found the user, redirect to their profile
      // Use type assertion for safe access to user properties
      const userObj = user as any;
      const exactUserName = userObj.userName || userName;
      redirect(`/profile/${exactUserName}`);
    }

    // No user found with this userName either
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 py-24">
        <h1 className="text-3xl font-bold">User Not Found</h1>
        <p className="text-muted-foreground">
          {cardIdToUse ? (
            <>
              No user was found with card ID: <strong>{cardIdToUse}</strong>
              <br />
              or username: <strong>{userName}</strong>
            </>
          ) : (
            <>
              No user was found with username: <strong>{userName}</strong>
            </>
          )}
        </p>
        <a
          href="/profile"
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors"
        >
          Try Another Search
        </a>
      </div>
    );
  }

  // If nothing was found and no search criteria was provided, show the search form
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 py-24">
      <h1 className="text-3xl font-bold">User Lookup</h1>
      {cardIdToUse && (
        <p className="text-muted-foreground text-red-500">
          No user was found with card ID: <strong>{cardIdToUse}</strong>
        </p>
      )}
      <p className="text-muted-foreground">Search by card ID or username:</p>
      <form action="" className="w-full max-w-sm space-y-4">
        <div className="flex flex-col gap-4">
          <input
            type="text"
            name="cardId"
            placeholder="Enter card ID"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
          />
          <div className="text-center">- OR -</div>
          <input
            type="text"
            name="username"
            placeholder="Enter username"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
          />
          <button
            type="submit"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors"
          >
            Search
          </button>
        </div>
      </form>
    </div>
  );
}
