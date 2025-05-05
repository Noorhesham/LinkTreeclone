import Image from "next/image";
import Hero from "../components/Hero";
import { auth } from "@clerk/nextjs/server";
import User from "../lib/models/userModel";
import connect from "../lib/db";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId } = auth();
  let user = null;
  if (userId) {
    await connect();
    user = await User.findOne({ clerkUserId: userId }).lean();
    //@ts-ignore
    if (user?.isAdmin) redirect("/admin");
  }
  return (
    <div>
      <Hero user={user} />
    </div>
  );
}
