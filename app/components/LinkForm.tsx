"use client";
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { addLink, updateLink } from "../linkActions/actions";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { FaPen } from "react-icons/fa";
import { Delete } from "./Delete";
import { SelectDemo } from "./Select";
import FormInput from "./FormInput";
import Button from "./Button";
import { PenIcon, PlusIcon } from "lucide-react";
import Image from "next/image";

const linkSchema = z.object({
  link: z.string().url({ message: "Invalid URL" }),
  provider: z.string().min(1, { message: "Required" }),
  _id: z.string().optional(),
});

const LinkForm = ({ userId, linkData, handleDeleteLink }: { userId: string; linkData: any; handleDeleteLink: any }) => {
  const form = useForm<z.infer<typeof linkSchema>>({
    defaultValues: linkData,
    resolver: zodResolver(linkSchema),
  });

  const [isPending, startTransition] = useTransition();
  const [image, setImage] = useState(form.getValues("provider"));
  const router = useRouter();

  const onSubmit = (data: any) => {
    startTransition(async () => {
      console.log(data, userId, linkData._id);
      const res: any = linkData._id ? await updateLink(data, linkData._id) : await addLink(data, userId);
      if (res.success) {
        toast.success(res.success);
        router.refresh();
      } else {
        toast.error(res.error);
      }
    });
  };
  console.log(form.getValues("provider"));
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex bg-[#1f1f23]  rounded-2xl w-full flex-col gap-8 px-5 py-4">
        <div className="flex items-stretch gap-2">
          <div className="flex flex-col w-full gap-2">
            <SelectDemo setImage={setImage} control={form.control} name="provider" />
            <FormInput placeholder={`link for ${form.getValues("provider")}`} control={form.control} name="link" />
          </div>
          <div className="flex flex-col h-full items-center self-center px-1 py-1 gap-3">
            <Delete disabled={isPending} onClick={() => handleDeleteLink(linkData._id)} value={"Link"} />
          </div>
        </div>
      <div className="flex justify-between">
      {form.getValues("provider") && (
          <Image
            width={50}
            height={50}
            alt={`${form.getValues("provider")}`}
            src={`/${image}.png`}
          />
        )}
        <Button disabled={isPending} className="flex items-center self-end  gap-5">
          {!linkData._id ? <PlusIcon /> : <PenIcon />} {linkData._id ? "Update" : "Add"} Link
        </Button>
      </div>
      </form>
    </Form>
  );
};

export default LinkForm;
