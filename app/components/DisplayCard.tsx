"use client";
import Image from "next/image";
import React from "react";
import { IoCopy } from "react-icons/io5";
import { toast } from "react-toastify";
import { TiTick } from "react-icons/ti";
import { CiLink } from "react-icons/ci";
import Link from "next/link";

const DisplayCard = ({ link }: { link: { link: string; provider: string; _id: string } }) => {
  const [copied, setCopied] = React.useState(false);
  const handleCopyLink = () => {
    try {
      navigator.clipboard.writeText(link.link);
      toast.success("Link copied to clipboard!");
      setCopied((c) => !c);
    } catch (error) {
      toast.error("Failed to copy the link");
    }
  };
  return (
    <div className=" border border-background hover:bg-opacity-85 duration-200 bg-[#1f1f23] flex items-center w-[90%] gap-5 rounded-3xl py-3 px-6">
      <div className=" aspect-square w-24 h-24 rounded-full relative">
        <Image className=" object-cover" src={`/${link.provider}.png`} fill alt={link.provider} />
      </div>
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold">{link.provider}</h2>
        <p
          onClick={handleCopyLink}
          className="text-lg hover:text-violet-400 duration-200 gap-3 cursor-pointer  text-muted-foreground flex items-center"
        >
          {copied ? <TiTick /> : <IoCopy />}
          {link.link}
        </p>
      </div>
      <Link href={link.link} className="slef-end text-4xl cursor-pointer ml-auto">
        <CiLink />{" "}
      </Link>
    </div>
  );
};

export default DisplayCard;
