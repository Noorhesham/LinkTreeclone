"use client";
import Link from "next/link";
import { SignInButton, SignUpButton, UserButton, useAuth } from "@clerk/nextjs";
import MaxWidthWrapper from "./MaxWidthWrapper";
import PhoneNav from "./PhoneNav";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "./LanguageSwitcher";

const PRODUCT_CATEGORIES: { text: string; url: string }[] = [
  { url: "/", text: "Home" },
  { url: "/protected/create", text: "Create" },
  { url: "/contact", text: "Contact" },
];

export default function NavBar() {
  const { isSignedIn, userId } = useAuth();
  const t = useTranslations();

  return (
    <nav className={`bg-slate-950/70 duration-150  fixed z-50  top-0  inset-0 h-16`}>
      <header className={`bg-slate-950/70  duration-150  relative `}>
        <MaxWidthWrapper>
          <div className="border-b border-foreground">
            <div className="flex h-16 items-center">
              <div className="ml-4 hidden lg:flex">
                <Link href={"/"}>
                  <h1 className="sm:text-base md:text-lg lg:text-2xl font-bold">{t("navbar.title")}</h1>
                </Link>
              </div>
              <div className="hidden flex-grow lg:block z-50">
                <div className="hidden lg:flex items-center justify-center gap-4 h-full">
                  {PRODUCT_CATEGORIES.map((category, i) => (
                    <Button key={i} variant={"ghost"} className="gap-1.5">
                      <Link href={category.url}>{t(`navbar.${category.text.toLowerCase()}`)}</Link>
                    </Button>
                  ))}
                </div>
              </div>
              <div className="rounded-full mx-6 mr-10 lg:mr-0 ml-auto flex gap-6 items-center">
                <LanguageSwitcher />
                {isSignedIn && (
                  <>
                    <UserButton
                      afterSignOutUrl="/"
                      appearance={{
                        elements: {
                          avatarBox: "w-[3.2rem]  mr-4 md:mr-0 h-[3.2rem] rounded-full",
                          userButtonAvatarBox: "w-[3.2rem] h-[3.2rem] rounded-full",
                        },
                      }}
                    />
                  </>
                )}
                {!isSignedIn && (
                  <div className="flex text-sm mr-4 md:mr-0  md:text-base items-center gap-5">
                    <SignUpButton>{t("navbar.signUp")}</SignUpButton>
                    <SignInButton>{t("navbar.signIn")}</SignInButton>
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
