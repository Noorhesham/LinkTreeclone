"use client";
import Link from "next/link";
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { useState } from "react";
import PhoneNav from "./PhoneNav";
import { Button } from "@/components/ui/button";
const PRODUCT_CATEGORIES: { text: string; url: string }[] = [
  { url: "/", text: "Home" },
  { url: "/protected/create", text: "Create" },
  { url: "/contact", text: "Contact" },
];

export default function NavBar({ user }: { user: any }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  console.log(user);
  return (
    <nav
      className={` ${isScrolled ? "bg-background" : "bg-transparent"} duration-150  fixed z-50  top-0  inset-0 h-16`}
    >
      <header className={` ${isScrolled ? " bg-background" : "bg-transparent"} duration-150  relative `}>
        <MaxWidthWrapper>
          <div className=" border-b pb-2 border-foreground">
            <div className=" flex  h-16 items-center">
              {/* mobile nav */}
              <div className=" ml-4 flex ">
                <Link href={"/"}>
                  <h1 className="text-2xl font-bold">Generate Link Now</h1>
                </Link>
              </div>
              <div className="hidden flex-grow  lg:block  z-50">
                <div className="flex items-center justify-center gap-4  h-full">
                  {PRODUCT_CATEGORIES.map((category, i) => (
                    <Button key={i} variant={"ghost"} className="gap-1.5 ">
                      <Link href={category.url}>{category.text}</Link>
                    </Button>
                  ))}
                </div>
              </div>
              <div className=" rounded-full  mr-6  lg:mr-0 ml-auto flex items-center">
                {user && (
                  <>
                    <UserButton
                      appearance={{
                        elements: {
                          avatarBox: "w-[3.2rem] h-[3.2rem] rounded-full",
                          userButtonAvatarBox: "w-[3.2rem] h-[3.2rem] rounded-full",
                        },
                      }}
                    />
                  </>
                )}
                {!user && (
                  <div className="flex items-center gap-5">
                    <SignUpButton />
                    <SignInButton />
                  </div>
                )}
                <PhoneNav navigation={PRODUCT_CATEGORIES} />
              </div>
            </div>
          </div>
        </MaxWidthWrapper>
      </header>
    </nav>
  );
}
