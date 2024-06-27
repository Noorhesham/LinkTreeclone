import { Button } from "@/components/ui/button";
import React from "react";
import { FcApproval } from "react-icons/fc";
import { UserButton, UserProfile } from "@clerk/nextjs";
import Link from "next/link";

const UserCard = ({ user }: { user: any }) => {
  return (
    <div className="flex relative flex-col items-center py-2 px-4  md:py-4 md:px-8 ">
      <UserButton appearance={{
          elements: {
            avatarBox:  "w-[8rem] h-[8rem]  rounded-full",
            userButtonAvatarBox: "w-[8rem] h-[8rem]  rounded-full",
          },
        }} />
      <div className="flex  w-full  rounded-3xl text-gray-800 items-center text-lg  flex-col gap-2">
        <div className="  mt-5 flex flex-col items-center">
          <h1 className=" font-bold text-gray-50 flex items-center gap-2">
            {user.name} <FcApproval />
          </h1>
          {<h4 className=" text-gray-50">{user.email}</h4>}
        </div>
      </div>
      <Link className=" underline my-2 hover:text-violet-500 duration-200"  href={`/profile/${user._id}`}>Show Public Profile</Link>
    </div>
  );
};

export default UserCard;
