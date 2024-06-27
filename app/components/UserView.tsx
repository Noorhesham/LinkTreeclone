import React from "react";
import { FcApproval } from "react-icons/fc";

const UserView = ({ user }: { user: any }) => {
  return (
    <div className="flex  relative overflow-hidden w-full mb-auto h-full self-stretch flex-col items-center py-2 px-4  md:py-4 md:px-8 ">
      <div className="image-wrapper shine rounded-full ">
        <img src={user?.photo} className="rounded-full" />
      </div>
      <div className="flex z-5 py-5 px-10 w-full  rounded-3xl  text-gray-800 items-center text-lg  flex-col gap-2">
        <div className="   flex flex-col items-center">
          <h1 className=" font-bold text-gray-50 flex items-center gap-2">
            {user.firstName} {user.lastName} <FcApproval />
          </h1>
          {<h4 className=" text-gray-50">{user.bio}</h4>}
        </div>
      </div>
    </div>
  );
};

export default UserView;
