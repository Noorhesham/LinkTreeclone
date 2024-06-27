import DisplyLinks from "@/app/components/DisplyLinks";
import MaxWidthWrapper from "@/app/components/MaxWidthWrapper";
import UserView from "@/app/components/UserView";
import UserCard from "@/app/components/View";
import connect from "@/app/lib/db";
import Link from "@/app/lib/models/linkModel";
import User from "@/app/lib/models/userModel";
import React from "react";

const page = async ({ params }: { params: { id: string } }) => {
  await connect();
  const user = await User.findById(params.id);
  const links = await Link.find({ userId: user._id });
  return (
    <MaxWidthWrapper>
      <section className="w-full min-h-screen pt-20">
      <div className="flex flex-col gap-5 mt-10">
        <UserView user={user} />
        <DisplyLinks links={links} />
      </div>
    </section>
    </MaxWidthWrapper>
  );
};

export default page;
