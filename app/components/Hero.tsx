"use client";
import React from "react";
import LargeHeading from "./LargeHeading";
import AnimatedImage from "./AnimatedImage";
import { GrLike } from "react-icons/gr";
import { CiUnlock } from "react-icons/ci";
import { IoIosHeartEmpty } from "react-icons/io";
import { MouseParallax } from "react-just-parallax";
import InputUserName from "./InputUserName";
import { useAuth } from "@clerk/nextjs";
import Button from "./Button";
import { useTranslations } from "next-intl";
import Link from "next/link";
import NFCWriter from "./WriteNfc";

const Hero = ({ user }: { user?: any }) => {
  const { isLoaded, sessionId, userId } = useAuth();
  const locale = useTranslations();
  const t = useTranslations();
  return (
    <section className="flex min-h-screen flex-col pt-28 md:pt-14  lg:pt-24 overflow-hidden lg:flex-row relative items-center lg:gap-20 justify-center px-10 lg:px-20">
      <span className="w-32 h-12 scale-125 -rotate-45 absolute top-36 -left-12 bg-violet-700/50 rounded-full"></span>
      <span className="w-32 h-12 scale-125 -rotate-45 absolute top-64 -left-10 bg-violet-700/50 rounded-full"></span>
      <span className="w-32 h-12 scale-125 -rotate-45 absolute top-36 -right-12 bg-violet-700/50 rounded-full"></span>
      <span className="w-32 h-12 scale-125 -rotate-45 absolute top-64 -right-10 bg-violet-700/50 rounded-full"></span>
      <div className="w-full lg:border-l-2 text-center lg:text-left lg:pl-5 relative flex flex-col">
        <LargeHeading
          colorful={t("hero.highlight")}
          heighlight={t("hero.welcome")}
          paragraph={t("hero.paragraph")}
          text={t("hero.text")}
        />
        <div className="flex items-center mt-5 lg:items-start gap-5">
          <div className="flex flex-col  gap-3 mx-auto md:mx-0 md:mt-0 md:flex-row items-center">
            {!userId ? (
              <>
                {" "}
                <Button text={t("hero.getStarted")}>
                  <Link href={`/sign-up`}>
                    <CiUnlock />
                  </Link>
                </Button>
                <Button>
                  <Link href={`/sign-in`}>{t("hero.logIn")}</Link>
                </Button>
              </>
            ) : (
              <div className="flex flex-col items-start">
                <InputUserName
                  fieldType="userName"
                  value={user?.userName || ""}
                  id={user?._id}
                  disablee={user?.userName!!}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <MouseParallax strength={0.07}>
        <div className="z-10 overflow-x-hidden max-w-[45rem] relative flex-grow mt-auto h-full">
          <GrLike className="py-2 px-2 right-12 lg:right-10 top-32 rounded-lg text-5xl bg-[#1D61E770] text-white absolute" />
          <IoIosHeartEmpty className="py-2 px-2 bottom-44 left-60 lg:left-auto lg:right-52 rounded-lg text-5xl bg-[#1D61E770] text-white absolute" />
          <CiUnlock className="py-2 px-2 left-20 lg:left-5 bottom-36 rounded-lg text-5xl bg-[#1D61E770] text-white absolute" />
          <AnimatedImage className="overflow-hidden bg-transparent w-full md:w-[26rem] lg:w-full" />
        </div>
      </MouseParallax>
    </section>
  );
};

export default Hero;
