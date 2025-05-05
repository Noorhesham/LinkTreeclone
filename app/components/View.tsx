import React from "react";
import { FcApproval } from "react-icons/fc";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import ImageCoverForm from "./ImageCoverForm";

const UserCard = ({ user }: { user: any }) => {
  return (
    <div className="flex w-full rounded-2xl relative flex-col items-center py-2 px-4  md:py-2 md:px-8 ">
      <ImageCoverForm user={user} />

      <div className="flex flex-col items-center -mt-24">
        <UserButton
          appearance={{
            elements: {
              avatarBox: "w-[8rem] h-[8rem] object-cover rounded-full",
              userButtonAvatarBox: "w-[8rem] h-[8rem]   object-cover rounded-full",
            },
          }}
        />
        <div className="flex  w-full  rounded-3xl text-gray-800 items-center text-lg  flex-col gap-2">
          <div className="  mt-5 flex flex-col items-center">
            <h1 className=" font-bold flex-row text-gray-50 flex items-center gap-2">
              {user.firstName} {user.lastName} <FcApproval />
            </h1>
            {<h4 className=" text-gray-50">{user.email}</h4>}
          </div>
        </div>
        {user.userName && (
          <Link className=" underline my-2 hover:text-violet-500 duration-200" href={`/profile/${user.cardId||""}?userName=${user.userName}`}>
            Show Public Profile
          </Link>
        )}
      </div>
    </div>
  );
};

export default UserCard;
