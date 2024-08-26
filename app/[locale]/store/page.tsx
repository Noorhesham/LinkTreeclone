import MaxWidthWrapper from "@/app/components/MaxWidthWrapper";
import ProductReel from "@/app/components/ProductReel";
import React from "react";
import { auth } from "@clerk/nextjs/server";
import User from "@/app/lib/models/userModel";
import connect from "@/app/lib/db";

const page = async () => {
  const { userId } = await auth();

  await connect();
  const user: any = await User.findOne({ clerkUserId: userId }).lean();
  return (
    <MaxWidthWrapper className=" px-8 py-4 lg:py-10 lg:px-20">
      <ProductReel user={user} title="Vega Shop" />
    </MaxWidthWrapper>
  );
};

export default page;
