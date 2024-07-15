"use client";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { FaImage } from "react-icons/fa";
import { IoIosColorPalette } from "react-icons/io";
import { addCoverImage, deleteImage, toggleImg } from "../lib/actions/actions";
import { toast } from "react-toastify";
import Image from "next/image";
import BabySpinner from "./BabySpinner";
import { useTranslations } from "next-intl";

const ImageCoverForm = ({ user }: { user: any }) => {
  console.log(user);
  const t = useTranslations("ImageCoverForm");
  const form = useForm({ defaultValues: { cover: user.coverColor || undefined } });
  const [isImage, setIsImage] = useState(true);

  const [isPending, startTransition] = useTransition();
  const onSubmit = async (data: any) => {
    startTransition(async () => {
      if (isImage) {
        const file = data.cover[0];
        if (!file) {
          toast.error(t("noFileSelected"));
          return;
        }
        if (user.coverImage) {
          await deleteImage(user.coverImage.public_id);
        }
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "v7t8mt9o");

        try {
          const res = await fetch(process.env.NEXT_PUBLIC_PUBLIC_CLOUDINARY_URL!, {
            method: "POST",
            body: formData,
          });

          if (!res.ok) {
            throw new Error(t("fileUploadFailed"));
          }

          const { public_id, secure_url } = await res.json();
          const response: any = await addCoverImage({ public_id, secure_url });
          if (response.success) {
            toast.success(response.success);
          } else if (response.error) {
            toast.error(response.error);
          }
        } catch (error: any) {
          console.error(error);
          toast.error(error.message || t("unexpectedError"));
        }
      } else {
        const color = data.cover;
        try {
          const response: any = await addCoverImage({ color });
          console.log(response);
          if (response.success) {
            toast.success(response.success);
          } else if (response.error) {
            toast.error(response.error);
          }
        } catch (error: any) {
          console.error(error);
          toast.error(error.message || t("unexpectedError"));
        }
      }
    });
  };
  return (
    <div style={{ backgroundColor: user.coverColor }} className="bg-[#1f1f23] h-60  relative rounded-2xl w-full">
      {isImage && (form.getValues("cover")?.[0] instanceof File || user.coverImage) && (
        <>
          <Image
            fill
            alt="cover"
            className=" rounded-2xl object-cover"
            src={
              form.getValues("cover")?.[0] instanceof File
                ? URL.createObjectURL(form.getValues("cover")?.[0])
                : user.coverImage.secure_url
            }
          />
          {isPending && <BabySpinner />}
        </>
      )}
      <div className="flex w-52  md:w-96 flex-col items-center gap-2 absolute left-1/2 top-[35%] -translate-y-1/2 -translate-x-1/2">
        <div className="flex  w-full items-center gap-2 bg-background rounded-lg ">
          <div
            className={` flex-1 duration-200 flex cursor-pointer items-center  py-1.5 px-3 md:px-6 md:py-3 gap-2 ${
              isImage && " bg-slate-900 text-violet-400"
            } opacity-85`}
          >
            <h2>{t("image")}</h2>
            <FaImage />
          </div>
          {/* <div
            onClick={handleOnclick}
            className={`flex-1 duration-200 flex cursor-pointer items-center  py-1.5 px-3 md:px-6 md:py-3 gap-2 ${
              !isImage && " bg-slate-900 text-violet-400"
            } opacity-85`}
          >
            <h2>{t('color')}</h2>
            <IoIosColorPalette />
          </div> */}
        </div>
        <Form {...form}>
          <form className=" " onSubmit={form.handleSubmit(onSubmit)}>
            <div>
              <FormField
                control={form.control}
                name="cover"
                render={({ field }) => (
                  <FormItem className="  w-44 md:min-w-28 my-2">
                    <FormControl className="">
                      <div className=" flex gap-2 items-center">
                        <FormLabel className=" text-gray-50 text-nowrap ">
                          {isImage ? t("image") : t("color")}
                        </FormLabel>
                        {isImage ? (
                          <Input
                            onChange={(e) => {
                              const value = e.target.files;
                              field.onChange(value);
                              if (isImage) {
                                form.handleSubmit(onSubmit)();
                              }
                            }}
                            disabled={isPending}
                            type="file"
                          />
                        ) : (
                          <Input
                            disabled={isPending}
                            type="color"
                            defaultValue={user.coverColor}
                            onBlur={(e) => {
                              field.onChange(e.target.value);
                              form.handleSubmit(onSubmit)();
                            }}
                          />
                        )}
                      </div>
                    </FormControl>

                    <FormMessage className=" text-sm dark:text-red-500" />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ImageCoverForm;
