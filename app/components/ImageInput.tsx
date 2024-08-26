"use client";
import { TbCameraPlus } from "react-icons/tb";
import React from "react";
import Image from "next/image";
import { XIcon } from "lucide-react";
import { Delete } from "./Delete";
import { deleteImage } from "../lib/actions/actions";
import { useRouter } from "next/navigation";
import { deleteProductImage } from "../linkActions/actions";
import { toast } from "react-toastify";
import BabySpinner from "./BabySpinner";

const ImageInput = ({
  isPreview,
  setPreviews,
  isLoading,
  defaultImg,
  form,
  index,
  previews,
  productId,
}: {
  isPreview?: any;
  setPreview?: any;
  isLoading?: any;
  defaultImg: any;
  form: any;
  index: any;
  previews: any[];
  setPreviews: any;
  productId?: string;
}) => {
  const router = useRouter();
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newPreviews = [...previews];
      const currentImages = form.getValues("image") || [];

      Array.from(e.target.files).forEach((file) => {
        const previewUrl = URL.createObjectURL(file);
        newPreviews.push(previewUrl);
        currentImages.push(file);
      });

      // Filter out any undefined or null entries in the image array
      const filteredImages = currentImages.filter((image: any) => image !== undefined && image !== null);

      // Update the form with the new images array
      form.setValue("image", filteredImages);

      // Set the previews with valid preview URLs only
      setPreviews(newPreviews.filter((preview) => preview !== ""));
    }
  };
  return (
    <div className="flex flex-col relative w-80 h-52 mx-auto justify-center mb-3 gap-4 rounded-2xl">
      {isPreview || defaultImg ? (
        <label
          htmlFor="image"
          className="flex hover:bg-gray-800 duration-200 h-full flex-col group cursor-pointer items-center gap-2 py-5 px-10 rounded-2xl"
        >
          {isLoading && (
            <div className="absolute top-1/2  left-1/2 -translate-y-1/2 -translate-x-1/2">
              <BabySpinner />
            </div>
          )}
          {defaultImg && (
            <Delete
              value={"Delete"}
              btn={<XIcon className=" text-xl absolute z-10 top-2 right-2" />}
              onClick={async () => {
                const res = await deleteProductImage(defaultImg.public_id, productId || "");
                if (res.success) toast.success(res.success);
                router.refresh();
              }}
            />
          )}
          <input
            disabled={defaultImg !== undefined}
            id="image"
            type="file"
            className="hidden"
            onChange={handleImageChange}
          />
          <Image
            src={isPreview || defaultImg.secure_url}
            fill
            className="rounded-2xl hover:opacity-80 h-full duration-200 absolute object-contain"
            alt="upload"
          />
        </label>
      ) : (
        <>
          <label
            htmlFor="image"
            className="flex flex-col group cursor-pointer h-full items-center gap-2 py-10 px-10 rounded-2xl border-dashed border-gray-500 border-2"
          >
            <input
              id="image"
              disabled={defaultImg !== undefined}
              type="file"
              className="hidden"
              onChange={handleImageChange}
            />
            <TbCameraPlus className="text-4xl text-gray-50 group-hover:text-blue-500 duration-200" />
            <span className="group-hover:text-gray-100 duration-200 rounded-full mt-4">Upload</span>
          </label>
        </>
      )}
    </div>
  );
};

export default ImageInput;
