"use client";
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { z } from "zod";
import { motion } from "framer-motion";
import FormInput from "./FormInput";
import Button from "./Button";
import { PenIcon, PlusIcon } from "lucide-react";
import { updateProduct, uploadProduct } from "../linkActions/actions";
import ImageInput from "./ImageInput"; // Assume this component is updated to handle multiple images
import { InstagramLogoIcon } from "@radix-ui/react-icons";

const ProductSchema = z.object({
  name: z.string().min(1, { message: "Required" }),
  description: z.string().min(1, { message: "Required" }),
  price: z
    .union([z.string(), z.number()])
    .transform((value) => (typeof value === "string" ? parseInt(value, 10) : value))
    .refine((value) => !isNaN(value), { message: "Invalid number" }), // Optional: Add a refinement to ensure valid numbers
  currentStock: z
    .union([z.string(), z.number()])
    .transform((value) => (typeof value === "string" ? parseInt(value, 10) : value))
    .refine((value) => !isNaN(value), { message: "Invalid number" }),
  image: z.array(z.any()).optional(),
});

const CreateProductForm = ({ product }: { product?: any }) => {
  const t = useTranslations();
  const form = useForm<z.infer<typeof ProductSchema>>({
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      price: product?.price || "",
      currentStock: product?.currentStock || "",
    },
    resolver: zodResolver(ProductSchema),
  });
  const [isPending, startTransition] = useTransition();
  const [previews, setPreviews] = useState<string[]>(product?.image?.map((image: any) => image.secure_url) || []); // Array of previews
  const router = useRouter();

  const onSubmit = async (data: any) => {
    startTransition(async () => {
      try {
        let productData = { ...data };
        console.log(productData);
        if (data.image&&data.image.length > 0) {
          const uploadedImages = await Promise.all(
            data.image.map(async (file: File) => {
              console.log(file);
              if (!(file instanceof File)) return null;

              const formData = new FormData();
              formData.append("file", file);
              formData.append("upload_preset", "v7t8mt9o"); // Replace with your upload preset

              const res = await fetch(process.env.NEXT_PUBLIC_PUBLIC_CLOUDINARY_URL!, {
                method: "POST",
                body: formData,
              });

              if (!res.ok) {
                throw new Error("Failed to upload image");
              }

              const cloudinaryData = await res.json();
              return {
                secure_url: cloudinaryData.secure_url,
                public_id: cloudinaryData.public_id,
              };
            })
          );

          productData = {
            ...data,
            image: uploadedImages,
          }; // Array of image data}
        } // Replace with your upload preset
        console.log(product?._id);
        const serverRes: any = product?._id
          ? await updateProduct(productData, product._id)
          : await uploadProduct(productData);
        console.log(serverRes);
        if (serverRes.success) {
          toast.success(serverRes.success);
          router.refresh();
        } else {
          toast.error(serverRes.error);
        }
      } catch (error) {
        toast.error("An error occurred while creating the product.");
      }
    });
  };
  const arr = previews.length > 0 ? previews : Array.from({ length: 1 }, () => null);
  return (
    <Form {...form}>
      <motion.form
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        onSubmit={form.handleSubmit(onSubmit)}
        className={`flex duration-200  select-none rounded-2xl w-full flex-col gap-2 lg:gap-3 px-3 py-2 md:px-5 md:py-2`}
      >
        <div className="flex items-center gap-2">
          <div className="flex py-3 flex-col w-full gap-2">
            <div className="flex flex-wrap gap-2">
              {arr?.map((preview, index) => (
                <ImageInput
                  key={index}
                  isLoading={isPending}
                  form={form}
                  index={index}
                  isPreview={previews?.[index]}
                  setPreviews={setPreviews} // Updated to handle multiple previews
                  previews={previews}
                  productId={product?._id}
                  defaultImg={product?.image[index]} // Default to multiple images
                />
              ))}
            </div>
            <Button
              onClick={(e: any) => {
                e.preventDefault();
                setPreviews((prev) => [...prev, ""]);
              }}
            >
              Add Image
            </Button>
            <FormInput control={form.control} name="name" placeholder={t("product.name")} />
            <FormInput control={form.control} name="description" placeholder={t("product.description")} />
            <div className="flex items-center gap-3 my-3">
              <FormInput control={form.control} name="price" placeholder={t("product.price")} type="number" />
              <FormInput
                control={form.control}
                name="currentStock"
                placeholder={t("product.currentStock")}
                type="number"
              />
            </div>
          </div>
        </div>
        <div className="flex ml-10 justify-between">
          <div className="flex gap-3 items-center flex-row-reverse ml-auto self-end">
            <Button disabled={isPending} className="flex ml-auto items-center self-end gap-2 md:gap-5">
              {!product?._id ? <PlusIcon /> : <PenIcon />} {product?._id ? t("product.update") : t("product.create")}
            </Button>
            <div className="flex flex-col h-full items-center self-center px-1 py-1 gap-3"></div>
          </div>
        </div>
      </motion.form>
    </Form>
  );
};

export default CreateProductForm;
