"use client";
import React, { useEffect, useTransition } from "react";
import { cn, formatPrice } from "@/lib/utils";
import ImageSlider from "./ImageSlider";
import { ProductLoader } from "./ProductReel";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import CustomDialog from "./CustomDialog";
import { addToCart, deleteFromCart } from "../lib/actions/actions";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { useGetCart } from "../query/query";
import BabySpinner from "./BabySpinner";
import Counter from "./Counter";
const ProductCard = ({ product, index, username }: { product: any; index: number; username: string }) => {
  const { isSignedIn, userId } = useAuth();
  const [isVisible, setIsVisible] = React.useState(false);
  const [isPending, startTransition] = useTransition();
  const queryClient = useQueryClient();
  const handleAddToCart = async (ProductId: string) => {
    startTransition(async () => {
      if (!isSignedIn) {
        return;
      }
      const res = await addToCart(ProductId);
      if (res.success) {
        toast.success(res.success);
        queryClient.invalidateQueries({ queryKey: ["cart"] });
      } else {
        toast.error(res.error);
      }
    });
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, index * 75);
    return () => clearTimeout(timer);
  }, [index]);
  const { data, isLoading } = useGetCart();
  console.log(data);
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
        <p className=" my-2 font-medium text-right text-xs text-gray-200">{product.description}</p>
      </div>
      {username ? (
        isLoading ? (
          <BabySpinner />
        ) : data?.filter((item: any) => item._id === product._id).length > 0 ? (
          <Counter
            max={product.currentStock}
            length={data?.filter((item: any) => item._id === product._id).length}
            onAdd={() => handleAddToCart(product._id)}
            onDecrement={async () => {
              const res = await deleteFromCart(product._id);
              if (res.success) {
                toast.success(res.success);
                queryClient.invalidateQueries({ queryKey: ["cart"] });
              }
            }}
          />
        ) : (
          <Button onClick={() => handleAddToCart(product._id)}>Add To Cart</Button>
        )
      ) : (
        <CustomDialog
          btn={<Button>Add To Cart</Button>}
          content={
            <div className=" py-20 px-10">
              <p>{userId ? "You have to add your user name to make an order" : "Please sign in to make an order"}</p>
            </div>
          }
          title="Sign in"
        />
      )}
    </div>
  ) : (
    <ProductLoader />
  );
};

export default ProductCard;
