import React from "react";
import NFCWriter from "../../components/WriteNfc";
import MaxWidthWrapper from "@/app/components/MaxWidthWrapper";
import { auth } from "@clerk/nextjs/server";
import connect from "@/app/lib/db";
import User from "@/app/lib/models/userModel";

const page = async () => {
  const { userId } = auth();
  if (userId) {
    await connect();
    const user = await User.findOne({ clerkUserId: userId }).lean();
    //@ts-ignore
    if (!user.isAdmin) redirect("/");
  }
  return (
    <MaxWidthWrapper>
      <div className="flex justify-center items-center py-24 lg:py-6 px-12 bg-background  text-xl mt-10 h-full w-full lg:min-h-[60vh]">
        <NFCWriter />
      </div>
    </MaxWidthWrapper>
  );
};

export default page;
