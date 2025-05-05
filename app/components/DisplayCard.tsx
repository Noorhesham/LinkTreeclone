"use client";
import Image from "next/image";
import React from "react";
import { IoCopy } from "react-icons/io5";
import { toast } from "react-toastify";
import { TiTick } from "react-icons/ti";
import { CiLink } from "react-icons/ci";
import Link from "next/link";
import { useButtons } from "../context/ButtonProvider";

const DisplayCard = ({ link, theme }: { link: { link: string; provider: string; _id: string }; theme?: string }) => {
  const [copied, setCopied] = React.useState(false);
  const { border, color } = useButtons();
  const handleCopyLink = () => {
    try {
      navigator.clipboard.writeText(link.link);
      toast.success("Link copied to clipboard!");
      setCopied((c) => !c);
    } catch (error) {
      toast.error("Failed to copy the link");
    }
  };
  const getShortLink = (url: string) => {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.hostname; // Return the domain name
    } catch (error) {
      return url; // Return the original link if URL parsing fails
    }
  };

  return (
    <Link
      href={link.link}
      style={{ borderRadius: border, backgroundColor: color }}
      className={`  border border-background hover:bg-opacity-85 duration-200 ${
        theme ? `card-${theme}` : "bg-[#1f1f23]"
      } flex items-center w-[90%] gap-5 rounded-3xl py-2 md:py-3 px-4 md:px-6`}
    >
      <div className=" aspect-square w-10 h-10 md:w-24 md:h-24 rounded-full relative">
        <Image className=" object-contain" src={`/${link.provider}.png`} fill alt={link.provider} />
      </div>
      <div className="flex flex-col gap-1">
        <h2 className=" text-base md:text-2xl font-bold">{link.provider}</h2>
        <p
          onClick={handleCopyLink}
          className=" text-sm md:text-lg hover:text-violet-400 duration-200 gap-3 cursor-pointer  text-muted-foreground flex items-center"
        >
          {copied ? <TiTick /> : <IoCopy />}
          {getShortLink(link.link)}
        </p>
      </div>
      <div onClick={handleCopyLink} className="  justify-end  ml-auto  flex items-center gap-2">
        {link.name && (
          <p className=" rounded-full bg-gray-200 border-input border py-2 px-4 text-gray-900"> {link.name}</p>
        )}
        {/* <div className="slef-end text-xl md:text-4xl cursor-pointer ml-auto">
          <CiLink />{" "}
        </div> */}
      </div>
    </Link>
  );
};

export default DisplayCard;
