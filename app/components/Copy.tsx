"use client ";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { CopyIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";

const Copy = ({ user }: { user: any }) => {
  const [copied, setCopied] = useState(false);
  const t = useTranslations();
  const path = usePathname();
  const handleCopyLink = () => {
    const lang = path.split("/")[1] || "en"; // Default to "en" if no language is found
    try {
      navigator.clipboard.writeText(`https://vega-nfc.vercel.app/${lang}/profile/${user.userName}`);
      toast.success(t("linkCopied"));
      setCopied(true);
    } catch (error) {
      toast.error(t("copyLinkFailed"));
    }
  };
  return (
    <Button onClick={handleCopyLink} type="submit" size="sm" className="px-3">
      <span className="sr-only">{t("copy")}</span>
      <CopyIcon className="h-4 w-4" />
    </Button>
  );
};

export default Copy;
