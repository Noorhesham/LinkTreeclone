"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { FcApproval } from "react-icons/fc";
import { toast } from "react-toastify";
import { Share } from "./Share";
import { useTranslations } from "next-intl";
import { PhoneIcon } from "lucide-react";
import { MdEmail } from "react-icons/md";
const BASE = `https://vega-nfc.vercel.app`;
const UserView = ({ user }: { user: any }) => {
  const t = useTranslations("UserView");
  const [copied, setCopied] = React.useState(false);
  const path = usePathname();
  const locale = path.split("/")[1] || "en";

  const handleCopyLink = () => {
    try {           

      navigator.clipboard.writeText(`${BASE}/${locale}/profile/${user?.cardId||""}?userName=${user?.userName}`);
      toast.success(t("linkCopied"));
      setCopied(true);
    } catch (error) {
      toast.error(t("copyLinkFailed"));
    }
  };

  return (
    <div className="flex relative overflow-hidden w-full mb-auto h-full self-stretch flex-col items-center py-2 px-4 md:py-4 md:px-8">
      <div
        style={{ backgroundColor: !user.isImg && user.coverColor }}
        className="bg-[#1f1f23] h-64 relative rounded-2xl w-full"
      >
        {user.coverImage && (
          <div>
            <Image fill alt="cover" className="rounded-2xl object-cover" src={user?.coverImage?.secure_url} />
          </div>
        )}
      </div>
      <div className="flex flex-col items-center -mt-24">
        <div className="image-wrapper shine rounded-full">
          <Image fill alt={user?.firstName} src={user?.photo} className="rounded-full object-cover" />
        </div>
        <div className="flex z-5 py-3 px-5 md:py-5 md:px-10 w-full rounded-3xl text-gray-800 items-center text-lg flex-col gap-2">
          <div className="flex flex-col items-center">
            <h1 className="font-bold text-gray-50 flex items-center gap-2">
              {user.firstName} {user.lastName}{" "}
              <span className="text-gray-400 text-xs font-medium">{`(${user.userName || ""})`}</span> <FcApproval />
            </h1>
            {<h4 className="text-center text-gray-50">{user.bio}</h4>}
            <div className=" flex flex-col items-start gap-2 mt-3">
              {user.phone && (
                <div
                  onClick={() => window.open(`tel:${user.phone}`)}
                  className=" text-gray-50 cursor-pointer   text-sm font-semibold  flex items-center gap-2"
                >
                  <PhoneIcon className=" w-4 h-4" />
                  <p>{user.phone}</p>
                </div>
              )}
              {user.phone2 && (
                <div
                  onClick={() => window.open(`tel:${user.phone2}`)}
                  className=" text-gray-50 cursor-pointer   text-sm font-semibold  flex items-center gap-2"
                >
                  <PhoneIcon className=" w-4 h-4" />
                  <p>{user.phone2}</p>
                </div>
              )}
              {user.email && (
                <div
                  onClick={() => window.open(`mailto:${user.email}`)}
                  className="text-gray-50  cursor-pointer text-sm font-semibold flex items-center gap-2"
                >
                  <MdEmail className=" w-4 h-4" />
                  <p>{user.email}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-5">
          <Link
            className={`card-${user.theme} p-2 rounded-lg underline my-2 flex items-center gap-2 hover:text-violet-500 duration-200`}
            href={ `/profile/${user?.cardId|| ""}?userName=${user?.userName}` || ""}
            >
            {t("profileLink")}
          </Link>
          <Share theme={user.theme} onClick={handleCopyLink} link={`${BASE}/${locale}/profile/${user.userName}`} />
        </div>
      </div>
    </div>
  );
};

export default UserView;
