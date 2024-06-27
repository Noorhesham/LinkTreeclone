'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { FaShareAlt } from "react-icons/fa";
import { FcApproval } from "react-icons/fc";
import { toast } from "react-toastify";

const UserView = ({ user }: { user: any }) => {
  const [copied, setCopied] = React.useState(false);
  const path=usePathname()

  const handleCopyLink = () => {
    const fullUrl = window.location.origin + path;
    try {
      navigator.clipboard.writeText(fullUrl);
      toast.success("Link copied to clipboard!");
      setCopied(true);
    } catch (error) {
      toast.error("Failed to copy the link");
    }
  };

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
      <Link  className=" underline my-2 flex items-center gap-2 hover:text-violet-500 duration-200" href={`/profile/${user._id}`}>
        Public Profile Link <FaShareAlt onClick={handleCopyLink} />

      </Link>
    </div>
  );
};

export default UserView;
