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
import Cropper from "react-easy-crop";
import getCroppedImg from "@/lib/utils";
import Button from "./Button";

const ImageCoverForm = ({ user }: { user: any }) => {
  const t = useTranslations("ImageCoverForm");
  const form = useForm({ defaultValues: { cover: user.coverColor || undefined } });
  const [isImage, setIsImage] = useState(true);
  const [isPending, startTransition] = useTransition();

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const onSubmit = async (data: any) => {
    startTransition(async () => {
      if (isImage) {
        const file = data.cover[0];
        if (!file) {
          toast.error(t("noFileSelected"));
          return;
        }

        // Get the cropped image
        const croppedImage = await getCroppedImg(imageSrc!, croppedAreaPixels);

        if (user.coverImage) {
          await deleteImage(user.coverImage.public_id);
        }

        const formData = new FormData();
        formData.append("file", croppedImage);
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
          console.log({ public_id, secure_url });
          const response: any = await addCoverImage({ public_id, secure_url });
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={{ backgroundColor: user.coverColor }} className="bg-[#1f1f23] h-60  relative rounded-2xl w-full">
      {user.coverImage && (
        <Image fill src={user?.coverImage?.secure_url} alt="cover" className="rounded-2xl w-full w-full object-cover" />
      )}
      {imageSrc && (
        <div className=" absolute inset-0 w-full h-full">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={28 / 9} // Aspect ratio for a cover image
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            cropShape="rect" // Optional: For a rectangular crop area
            showGrid={false} // Optional: To hide the grid
          />
        </div>
      )}
      <div className="flex w-52  md:w-96 flex-col items-center gap-2 absolute left-1/2 top-[35%] -translate-y-1/2 -translate-x-1/2">
        <div className="flex  w-full items-center gap-2 bg-background rounded-lg ">
          {/* <div
            className={` flex-1 duration-200 flex cursor-pointer items-center  py-1.5 px-3 md:px-6 md:py-3 gap-2 ${
              isImage && " bg-slate-900 text-violet-400"
            } opacity-85`}
          >
            <h2>{t("image")}</h2>
            <FaImage />
          </div> */}
        </div>
        <Form {...form}>
          <form className=" " onSubmit={form.handleSubmit(onSubmit)}>
            <div>
              <FormField
                control={form.control}
                name="cover"
                render={({ field }) => (
                  <FormItem className="  w-44 full md:min-w-28 my-2">
                    <FormControl className="">
                      <div className=" flex gap-2 items-center">
                        <FormLabel className=" text-gray-50 text-nowrap ">
                          {isImage ? t("image") : t("color")}
                        </FormLabel>
                        {(
                          <label htmlFor="cover">
                            <Input
                              id="cover"
                              className={` w-full text-gray-50  file:text-gray-50 `}
                              onChange={(e) => {
                                handleImageChange(e);
                                field.onChange(e.target.files);
                              }}
                              disabled={isPending}
                              type="file"
                            />
                          </label>
                        )}
                      </div>
                    </FormControl>
                    {form.getValues("cover") && <Button disabled={isPending}>Upload Image</Button>}
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
