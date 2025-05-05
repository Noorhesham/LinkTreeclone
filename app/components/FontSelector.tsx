// components/FontSelector.tsx
"use client";

import { useTransition } from "react";
import { useFonts } from "../context/FontProvider";
import { updateFont } from "../linkActions/actions";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const fonts = [
  { name: "Poppins", className: "poppins" },
  { name: "Roboto", className: "roboto" },
  { name: "Inter", className: "inter" },
  { name: "Montserrat", className: "montserrat" },
  { name: "Nunito", className: "nunito" },
  { name: "Lato", className: "lato" },
  { name: "Open Sans", className: "open-sans" },
  { name: "Raleway", className: "raleway" },
  { name: "Oswald", className: "oswald" },
  { name: "Playfair Display", className: "playfair" },
  { name: "Merriweather", className: "merriweather" },
  { name: "Source Sans Pro", className: "source-sans-pro" },
  { name: "Quicksand", className: "quicksand" },
  { name: "Fira Sans", className: "fira-sans" },
  { name: "Work Sans", className: "work-sans" },
  { name: "DM Sans", className: "dm-sans" },
  { name: "Rubik", className: "rubik" },
  { name: "Bebas Neue", className: "bebas-neue" },
  { name: "Ubuntu", className: "ubuntu" },
  { name: "Cairo", className: "cairo", arabicSample: "مرحبا بك في القاهرة" },
  { name: "Amiri", className: "amiri", arabicSample: "مرحبا بك في عميري" },
  { name: "El Messiri", className: "el-messiri", arabicSample: "مرحبا بك في المسيري" },
  { name: "Lateef", className: "lateef", arabicSample: "مرحبا بك في لطييف" },
  { name: "Tajawal", className: "tajawal", arabicSample: "مرحبا بك في تجوال" },
  { name: "Noto Sans Arabic", className: "noto-sans-arabic", arabicSample: "مرحبا بك في نوتو" },
  { name: "Droid Arabic Kufi", className: "droid-arabic-kufi", arabicSample: "مرحبا بك في درويد" },
  { name: "Harmattan", className: "harmattan", arabicSample: "مرحبا بك في هارماتان" },
  { name: "Kufam", className: "kufam", arabicSample: "مرحبا بك في كوفام" },
  { name: "Noto Serif Arabic", className: "noto-serif-arabic", arabicSample: "مرحبا بك في نوتو سيريف" },
  { name: "Mada", className: "mada", arabicSample: "مرحبا بك في مادا" },
  { name: "Sukar", className: "sukar", arabicSample: "مرحبا بك في سكر" },
  { name: "Reem Kufi", className: "reem-kufi", arabicSample: "مرحبا بك في ريم كوفي" },
  { name: "Aref Ruqaa", className: "aref-ruqaa", arabicSample: "مرحبا بك في عارف رقعة" },
];

const FontSelector = () => {
  const { font, setFont } = useFonts();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const handleClick = (font: string) => {
    setFont(font);
    startTransition(async () => {
      const res: any = await updateFont(font);
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
      {fonts.map((fontItem, index) => (
        <div
          key={index}
          className={`cursor-pointer border p-2 rounded ${fontItem.className === font ? "border-blue-500" : ""}`}
          onClick={() => handleClick(fontItem.className)}
        >
          <h3 className={`${fontItem.className} text-2xl text-center text-gray-50`}>
            {fontItem.arabicSample || "ABC"}
          </h3>
          <p className="text-center text-xs">{fontItem.name}</p>
        </div>
      ))}
    </div>
  );
};

export default FontSelector;
