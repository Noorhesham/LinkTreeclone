import DisplyLinks from "@/app/components/DisplyLinks";
import MaxWidthWrapper from "@/app/components/MaxWidthWrapper";
import UserView from "@/app/components/UserView";
import UserCard from "@/app/components/View";
import connect from "@/app/lib/db";
import Link from "@/app/lib/models/linkModel";
import User from "@/app/lib/models/userModel";
import React from "react";
import "@/app/[locale]/fonts.css";
import { ButtonProvider } from "@/app/context/ButtonProvider";

const page = async ({ params }: { params: { username: string } }) => {
  await connect();
  const user: any = await User.findOne({ userName: params.username }).populate({ path: "links", model: Link }).lean();
  console.log(user);

  if (!user) {
    // Handle user not found case
    return <div>User not found</div>;
  }

  return (
    <ButtonProvider defaultBorder={user.buttons?.border} defaultColor={user.buttons?.color}>
      <MaxWidthWrapper>
        <section className={`w-full min-h-screen ${user.font} pt-20 theme-${user.theme}`}>
          <div className="flex flex-col gap-5">
            <UserView user={user} />
            {user.links && user.links.length > 0 ? (
              <DisplyLinks
                border={user.buttons.border}
                color={user.buttons.color}
                theme={user.theme}
                links={user.links}
              />
            ) : (
              <div>No links available</div>
            )}
          </div>
        </section>
      </MaxWidthWrapper>
    </ButtonProvider>
  );
};

export default page;
