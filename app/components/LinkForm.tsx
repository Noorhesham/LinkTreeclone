"use client";
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { addLink, updateLink } from "../linkActions/actions";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Delete } from "./Delete";
import { SelectDemo } from "./Select";
import FormInput from "./FormInput";
import { PenIcon, PlusIcon } from "lucide-react";
import Image from "next/image";
import { Reorder, useDragControls, useMotionValue } from "framer-motion";
import { useRaisedShadow } from "../hooks/useShadow";
import { motion } from "framer-motion";
import { ReorderIcon } from "./ReorderItem";
import { Button as Button2 } from "@/components/ui/button";
import Button from "./Button";
import { useTranslations } from "next-intl";
import { useThemes } from "../context/ThemeProvider";

const linkSchema = z.object({
  link: z.string().url({ message: "Invalid URL" }),
  provider: z.string().min(1, { message: "Required" }),
  _id: z.string().optional(),
  name: z.string().optional(),
});

const LinkForm = ({ userId, linkData, handleDeleteLink }: { userId: string; linkData: any; handleDeleteLink: any }) => {
  const t = useTranslations();
  const { theme } = useThemes();
  const form = useForm<z.infer<typeof linkSchema>>({
    defaultValues: linkData,
    resolver: zodResolver(linkSchema),
  });
  const y = useMotionValue(0);
  const boxShadow = useRaisedShadow(y);
  const dragControls = useDragControls();
  const [isPending, startTransition] = useTransition();
  const [image, setImage] = useState(form.getValues("provider"));
  const router = useRouter();

  const onSubmit = (data: any) => {
    startTransition(async () => {
      const res: any = linkData._id ? await updateLink(data, linkData._id) : await addLink(data, userId);
      if (res.success) {
        toast.success(res.success);
        router.refresh();
      } else {
        toast.error(res.error);
      }
    });
  };
  const selected = form.getValues("provider") === "Custom_Link";
  console.log(selected);
  return (
    <Reorder.Item
      className={`w-full   `}
      style={{ boxShadow, y }}
      dragListener={false}
      dragControls={dragControls}
      value={linkData}
    >
      <Form {...form}>
        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          onSubmit={form.handleSubmit(onSubmit)}
          className={`flex duration-200 ${
            theme ? `card-${theme}` : "bg-[#1f1f23]"
          }  select-none rounded-2xl w-full flex-col gap-2 lg:gap-3 px-3 py-2 md:px-5 md:py-2`}
        >
          <div className="flex items-center gap-2">
            <div className="mt-5 mr-4">
              <ReorderIcon dragControls={dragControls} />
            </div>
            <div className="flex py-3 flex-col w-full gap-2">
              <SelectDemo
                defaultProvider={linkData.provider}
                setImage={setImage}
                control={form.control}
                name="provider"
              />
              <FormInput
                placeholder={t("linkForm.linkForProvider", { provider: form.getValues("provider") })}
                control={form.control}
                name="link"
              />
              {selected && <FormInput placeholder={t("linkForm.name")} control={form.control} name="name" />}
            </div>
            {form.getValues("provider") && (
              <Image width={50} height={50} alt={`${form.getValues("provider")}`} src={`/${image}.png`} />
            )}
          </div>
          <div className="flex ml-10 justify-between">
            <div className="flex gap-3 items-center flex-row-reverse ml-auto self-end">
              <Button disabled={isPending} className="flex ml-auto items-center self-end gap-2 md:gap-5">
                {!linkData._id ? <PlusIcon /> : <PenIcon />}{" "}
                {linkData._id ? t("linkForm.updateLink") : t("linkForm.createLink")}
              </Button>
              <div className="flex flex-col h-full items-center self-center px-1 py-1 gap-3">
                <Delete
                  disabled={isPending}
                  btn={
                    <Button2
                      type="button"
                      className="bg-red-500 text-base font-semibold text-gray-50 hover:bg-red-400 duration-200"
                    >
                      {t("linkForm.delete")}
                    </Button2>
                  }
                  onClick={() => handleDeleteLink(linkData._id)}
                  value={"Link"}
                />
              </div>
            </div>
          </div>
        </motion.form>
      </Form>
    </Reorder.Item>
  );
};

export default LinkForm;
