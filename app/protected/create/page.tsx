import React from "react";
import CreateForm from "@/app/components/CreateForm";
import UserCard from "@/app/components/View";
import connect from "@/app/lib/db";
import User from "@/app/lib/models/userModel";
import Link from "@/app/lib/models/linkModel"; // Ensure Link model is imported
import { auth } from "@clerk/nextjs/server";
import InputUserName from "@/app/components/InputUserName";
import MaxWidthWrapper from "@/app/components/MaxWidthWrapper";

const page = async () => {
  const { userId } = await auth();
  await connect();
  const user = await User.findOne({ clerkUserId: userId })
  const links=await Link.find({userId:user._id})
  console.log(user)
  return (
    <MaxWidthWrapper>
      <section className="w-full min-h-screen pt-20">
      <div className="flex flex-col items-center gap-5 mt-10">
        <UserCard user={user} />
        <div className=" w-[45%]">
        <InputUserName bio={user.bio} id={user._id}/>
        </div>
        <CreateForm links={links} userId={user._id} />
      </div>
    </section>
    </MaxWidthWrapper>
  );
};

export default page;
