"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
interface ButtonContextType {
  border?: number | undefined;
  setBorder: (Button: number) => void;
  color?: string | undefined;
  setColor: (Button: string) => void;
}

const ButtonContext = createContext<ButtonContextType | undefined>(undefined);

export const ButtonProvider = ({
  children,
  defaultBorder,
  defaultColor,
}: {
  children: ReactNode;
  defaultBorder: number;
  defaultColor: string;
}) => {
  const [border, setBorder] = useState<number>(defaultBorder || 100);
  const [color, setColor] = useState<string>(defaultColor || "");
  return (
    <ButtonContext.Provider value={{ border, setBorder, color, setColor }}>
      <div>{children}</div>
    </ButtonContext.Provider>
  );
};

export const useButtons = () => {
  const context = useContext(ButtonContext);
  if (!context) {
    throw new Error("useButtons must be used within a ButtonProvider");
  }
  return context;
};
