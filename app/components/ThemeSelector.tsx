"use client";
import React from "react";
import { useTransition } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useThemes } from "../context/ThemeProvider";
import { updateTheme } from "../linkActions/actions";

const themes = [
  { name: "Default", className: "" },
  { name: "Yellow", className: "yellow" },
  { name: "Gradient", className: "gradient" },
  { name: "Light", className: "light" },
  { name: "Baby Blue", className: "babyBlue" },
  { name: "Clouds", className: "clouds" },
  { name: "Pebble", className: "pebble" },
  { name: "Breeze", className: "breeze" },
  { name: "3D Blocks", className: "3dblocks" },
  { name: "Starry Night", className: "starrynight" },
  { name: "Lake Black", className: "lakeblack" },
  { name: "Lake White", className: "lakewhite" },
  { name: "Hydrangea", className: "hydrangea" },
  { name: "Poppy", className: "poppy" },
  { name: "Iris", className: "iris" },
  { name: "Air White", className: "airwhite" },
  { name: "Air Moon", className: "airmoon" },
  { name: "Air Snow", className: "airsnow" },
  { name: "Space", className: "image1" },
  { name: "confetti", className: "image2" },
  { name: "Cartoon 1", className: "cartoon" },
  { name: "Cartoon 2", className: "cartoon2" },
  { name: "Cartoon 3", className: "cartoon3" },
  { name: "Cartoon 4", className: "cartoon4" },
  { name: "Cartoon 5", className: "cartoon5" },
];
const ThemeSelector = () => {
  const { theme, setTheme } = useThemes();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleClick = (theme: string) => {
    setTheme(theme);
    startTransition(async () => {
      const res: any = await updateTheme(theme);
      if (res.success) {
        toast.success(res.success);
        router.refresh();
      } else {
        toast.error(res.error);
      }
    });
  };

  return (
    <div className="grid grid-cols-2 max-h-[60vh] overflow-y-scroll lg:grid-cols-4 gap-2">
      {themes.map((themeItem, index) => (
        <div
          key={index}
          className={`cursor-pointer border p-2 rounded ${themeItem.className === theme ? "border-blue-500" : ""}`}
          onClick={() => handleClick(themeItem.className)}
        >
          <h3 className={`theme-${themeItem.className} text-2xl text-center text-gray-50`}>{themeItem.name}</h3>
        </div>
      ))}
    </div>
  );
};

export default ThemeSelector;
