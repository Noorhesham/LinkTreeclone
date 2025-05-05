import React from "react";
import { redirect } from "next/navigation";
import { getUserByCardId } from "@/app/lib/actions/actions";

export default async function ProfilePage({ searchParams }: { searchParams: { cardId?: string } }) {
  const { cardId } = searchParams;

  // If no cardId provided, redirect to home
  if (!cardId) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 py-24">
        <h1 className="text-3xl font-bold">User Lookup</h1>
        <p className="text-muted-foreground">Please provide a card ID to look up a user.</p>
        <form action="" className="w-full max-w-sm space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              name="cardId"
              placeholder="Enter card ID"
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

  // Try to find user by cardId
  const result = await getUserByCardId(cardId);

  // Handle error or no user found
  if (result.error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 py-24">
        <h1 className="text-3xl font-bold">User Not Found</h1>
        <p className="text-muted-foreground">
          No user was found with the card ID: <strong>{cardId}</strong>
        </p>
        <p className="text-muted-foreground">Please check the card ID and try again.</p>
        <a
          href="/profile"
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors"
        >
          Try Another Search
        </a>
      </div>
    );
  }

  // If user is found, redirect to their profile page
  const userName = result.data.user.userName;
  if (userName) {
    redirect(`/${userName}`);
  }

  // Fallback in case there's no username
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 py-24">
      <h1 className="text-3xl font-bold">User Found</h1>
      <p className="text-muted-foreground">
        A user was found with the card ID: <strong>{cardId}</strong>
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
