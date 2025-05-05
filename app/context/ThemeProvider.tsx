"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
interface ThemeContextType {
  theme: string;
  setTheme: (Theme: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children, defaultTheme }: { children: ReactNode; defaultTheme: string }) => {
  const [theme, setTheme] = useState<string>(defaultTheme);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div className={`theme-${theme}`}>{children}</div>
    </ThemeContext.Provider>
  );
};

export const useThemes = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemes must be used within a ThemeProvider");
  }
  return context;
};
