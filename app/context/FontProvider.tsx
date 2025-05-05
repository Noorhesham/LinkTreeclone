// context/FontContext.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface FontContextType {
  font: string;
  setFont: (font: string) => void;
}

const FontContext = createContext<FontContextType | undefined>(undefined);

export const FontProvider = ({ children ,defaultFont}: { children: ReactNode,defaultFont:string }) => {
  const fonts = {
    poppins: "Poppins",
    roboto: "Roboto",
    inter: "Inter",
    montserrat: "Montserrat",
    nunito: "Nunito",
  };
  const [font, setFont] = useState<string>(defaultFont || fonts.poppins);

  return (
    <FontContext.Provider value={{ font, setFont }}>
      <div className={font}>{children}</div>
    </FontContext.Provider>
  );
};

export const useFonts = () => {
  const context = useContext(FontContext);
  if (!context) {
    throw new Error("useFonts must be used within a FontProvider");
  }
  return context;
};
