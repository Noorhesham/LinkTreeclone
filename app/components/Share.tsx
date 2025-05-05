import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CopyIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { FaShareAlt } from "react-icons/fa";

export function Share({ link, onClick, theme }: { link: string; onClick: any; theme?: string }) {
  const t = useTranslations("UserView");
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className={` card-${theme} flex items-center gap-3`}>
          {t("share")} <FaShareAlt />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("share")}</DialogTitle>
          <DialogDescription>{t("shareDesc")}</DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              {t("share")}
            </Label>
            <Input id="link" defaultValue={link} readOnly />
          </div>
          <Button onClick={onClick} type="submit" size="sm" className="px-3">
            <span className="sr-only">{t("copy")}</span>
            <CopyIcon className="h-4 w-4" />
          </Button>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              {t("close")}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
