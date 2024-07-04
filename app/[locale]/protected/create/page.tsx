import React from "react";
import CreateForm from "@/app/components/CreateForm";
import UserCard from "@/app/components/View";
import connect from "@/app/lib/db";
import User from "@/app/lib/models/userModel";
import Link from "@/app/lib/models/linkModel"; // Ensure Link model is imported
import { auth } from "@clerk/nextjs/server";
import InputUserName from "@/app/components/InputUserName";
import MaxWidthWrapper from "@/app/components/MaxWidthWrapper";
import { redirect } from "next/navigation";
import CustomDialog from "@/app/components/CustomDialog";
import Button from "@/app/components/Button";
import "@/app/[locale]/fonts.css";
import { FontProvider } from "@/app/context/FontProvider";
import { ThemeProvider } from "@/app/context/ThemeProvider";
import FontSelector from "@/app/components/FontSelector";
import ThemeSelector from "@/app/components/ThemeSelector";
import FontWrapper from "@/app/components/FontWrapper";
const page = async () => {
  const { userId } = await auth();
  if (!userId) redirect("/");
  await connect();
  const user: any = await User.findOne({ clerkUserId: userId }).populate({ path: "links", model: Link }).lean();
  if (!user) return <h1>User not found</h1>;
  return (
    <FontProvider defaultFont={user.font}>
      <ThemeProvider defaultTheme={user.theme}>
        <MaxWidthWrapper>
          <FontWrapper defaultFont={user.font}>
            <div className={` w-full min-h-screen pt-20`}>
              <div className="flex flex-col items-center">
                <UserCard user={user} />
                <div className=" w-full flex-col  md:justify-center flex items-center gap-2 md:w-[100%]">
                  <div className="flex flex-col items-center">
                    <InputUserName disablee={false} fieldType="bio" value={user.bio} id={user._id} />
                    <InputUserName disablee={false} fieldType="userName" value={user?.userName || ""} id={user?._id} />
                  </div>
                  <div className="flex gap-4 items-center">
                    <CustomDialog
                      content={<FontSelector />}
                      btn={<Button text="Change Font" />}
                      title="Here you can adjust your font."
                    />
                    <CustomDialog
                      content={<ThemeSelector />}
                      btn={<Button text="Change Theme" />}
                      title="Here you can adjust your Theme."
                    />
                  </div>
                </div>
                <CreateForm links={user.links} userId={user._id} />
              </div>
            </div>
          </FontWrapper>
        </MaxWidthWrapper>
      </ThemeProvider>
    </FontProvider>
  );
};

export default page;

//card layouts
//public page
//cutom 404
