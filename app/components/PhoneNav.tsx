"use client";
import React, { useState } from "react";
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import MenuSvg from "./MenuSvg";
import { useTranslations } from "next-intl";
const container = {
  hidden: { opacity: 1, scale: 0 },
  exit: { opacity: 0, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { y: 10, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};
const PhoneNav = ({ navigation }: { navigation: any }) => {
  const pathName = usePathname();
  const t = useTranslations();
  const [openNavigation, setOpenNavigation] = useState(false);
  const handleClick = () => {
    if (!openNavigation || !(window.innerWidth <= 1024)) return;
    enablePageScroll();
    setOpenNavigation(false);
  };
  const toggleNavigation = () => {
    if (openNavigation) {
      setOpenNavigation(false);
      enablePageScroll();
    } else {
      setOpenNavigation(true);
      disablePageScroll();
    }
  };
  return (
    <div className="">
      <AnimatePresence>
        {openNavigation && (
          <motion.nav
            variants={container}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`${
              openNavigation ? "flex" : "hidden"
            }  fixed top-0 left-0 bg-black/40 backdrop-blur-lg bottom-0 right-0 z-40 bg-n-8 lg:static lg:flex lg:mx-auto lg:bg-transparent`}
          >
            <div className=" relative z-2 flex flex-col items-center justify-center m-auto lg:flex-row">
              {navigation.map((link: any, i: number) => (
                <motion.a
                  variants={item}
                  onClick={handleClick}
                  className={`block relative font-code text-2xl uppercase text-gray-50  hover:text-gray-200 transition-colors hover:text-color-1
      px-6 py-6 md:py-8 lg:-mr-0.25 lg:text-xs lg:font-semibold lg:leading-5 xl:px-12`}
                  href={link.url}
                  key={i}
                >
                  {t(`navbar.${link.text.toLowerCase()}`)}
                </motion.a>
              ))}
            </div>
            {/* <HambugerMenu /> */}
          </motion.nav>
        )}
      </AnimatePresence>
      <button className="ml-auto z-50 right-2 fixed top-7 lg:hidden" onClick={toggleNavigation}>
        <MenuSvg openNavigation={openNavigation} />
      </button>
    </div>
  );
};

export default PhoneNav;
