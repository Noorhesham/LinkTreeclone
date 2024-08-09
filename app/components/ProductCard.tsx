"use client";
import React, { useEffect } from "react";
import { cn, formatPrice } from "@/lib/utils";
import ImageSlider from "./ImageSlider";
import { ProductLoader } from "./ProductReel";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import CustomDialog from "./CustomDialog";
const ProductCard = ({ product, index }: { product: any; index: number }) => {
  const { isSignedIn, userId } = useAuth();
  const [isVisible, setIsVisible] = React.useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, index * 75);
    return () => clearTimeout(timer);
  }, [index]);
  return isVisible ? (
    <div
      className={`${cn(" opacity-0  h-full relative w-full cursor-pointer group-main ", {
        " opacity-100 animate-in duration-200 fade-in-5 shadow-sm rounded-xl": isVisible,
      })} self-stretch flex flex-col `}
    >
      <ImageSlider
        stock={product.stock}
        productId={product._id}
        urls={product.image.map((image: any) => image.secure_url)}
      />
      <div className=" flex flex-col self-stretch justify-between py-1 px-2 w-full">
        <div className="flex items-center justify-between">
          <h3 className=" mt-4 font-medium text-sm text-gray-100 ">
            {product.name.length > 20 ? product.name.substring(0, 20) + "..." : product.name}
          </h3>{" "}
          <p className=" mt-1 font-medium text-sm text-gray-200">{formatPrice(product.price)}</p>
        </div>
        <div className=" flex items-start flex-col gap-2 mt-auto">
          <p className=" mt-1 font-medium text-sm text-gray-200">Stock : {product.currentStock}</p>
        </div>
      </div>
      {userId ? (
        <Button>Order Now</Button>
      ) : (
        <CustomDialog btn={<Button>Order Now</Button>} content={<div className=" py-20 px-10">
            <p>Sign in to order</p>
        </div>} title="Sign in" />
      )}
    </div>
  ) : (
    <ProductLoader />
  );
};

export default ProductCard;
