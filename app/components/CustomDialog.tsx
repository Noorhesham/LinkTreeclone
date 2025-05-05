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

import { ReactElement, ReactNode } from "react";
const CustomDialog = ({ btn, title, content,save=true }: { btn: ReactElement; title: string; content: ReactNode,save?:boolean }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{btn}</DialogTrigger>
      <DialogContent className="sm:max-w-[825px] overflow-y-scroll sm:max-h-[30rem]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>Make changes here. Click save when you are done.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">{content}</div>
     <DialogClose>
     <DialogFooter >
          {save&&<Button className=" text-gray-50" type="button">Save changes</Button>}
        </DialogFooter>
     </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default CustomDialog;
