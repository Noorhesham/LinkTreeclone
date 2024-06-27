import CreateForm from "@/app/components/CreateForm";
import UserCard from "@/app/components/View";
import connect from "@/app/lib/db";
import Link from "@/app/lib/models/linkModel";
import User from "@/app/lib/models/userModel";
import { auth } from "@clerk/nextjs/server";
import React from "react";

const page = async () => {
  const { userId } = await auth();
  await connect()
  const user = await User.findOne({ clerkUserId: userId });
  const links=await Link.find({userId:user._id})
  console.log(user,links)
  return (
    <section className=" w-full min-h-screen   pt-20 ">
      <div className="flex flex-col gap-5 mt-10">
      <UserCard user={user} />
      <CreateForm userId={user._id} />
      </div>
    </section>
  );
};

export default page;
