"use client";
import React, { ReactNode } from "react";
import { FontProvider, useFonts } from "@/app/context/FontProvider";

const FontWrapper = ({ children, defaultFont }: { children: ReactNode; defaultFont: string }) => {
  const { font } = useFonts();
  return <section className={`.${font}`}>{children}</section>;
};

export default FontWrapper;
