"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
const LanguageSwitcher = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const currentLocale = useLocale();
  const pathName = usePathname();
  const t = useTranslations();
  const handleSelect = (value: string) => {
    if (value === currentLocale) return; 
    startTransition(() => {
      const newPathName = pathName.replace(`/${currentLocale}`, `/${value}`);
      router.push(newPathName);
    });
  };

  return (
    <Select disabled={isPending} defaultValue={currentLocale} onValueChange={handleSelect}>
      <SelectTrigger className="w-[90px] text-sm">
        <SelectValue placeholder={t("languageSwitcher.selectLanguage")} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Select a language</SelectLabel>
          <SelectItem value="en">English</SelectItem>
          <SelectItem value="ar">العربية</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default LanguageSwitcher;
