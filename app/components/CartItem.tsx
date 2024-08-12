"use client";
import React from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteFromCart } from "../lib/actions/actions";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";

const CartItem = ({ product, nodel }: { product: any; nodel?: boolean }) => {
  console.log(product);
  const queryClient = useQueryClient();
  return (
    <div className=" space-y-3 py-2">
      <div className="flex items-start justify-between gap-4">
        <div className=" flex items-center space-x-4">
          <div className=" relative aspect-square w-16 h-16 min-w-fit overflow-hidden rounded">
            <Image src={product.image?.[0]?.secure_url} alt={product.name} fill className=" object-cover" />
          </div>
          <div className="flex flex-col self-start">
            <div className=" hover:text-violet-400 hover:underline duration-150 line-clamp-1 text-sm font-medium mb-1">
              {product.name}
            </div>{" "}
            <div className=" mt-4 text-xs text-muted-foreground">
              {!nodel && (
                <Button
                  aria-label="Remove item"
                  variant={"ghost"}
                  onClick={async () => {
                    const res = await deleteFromCart(product._id);
                    if (res.success) {
                      toast.success(res.success);
                      queryClient.invalidateQueries({ queryKey: ["cart"] });
                    }
                  }}
                  className="flex  hover:text-violet-400 duration-150 items-center gap-0.5"
                >
                  <X className="w-3 h-4" />
                  Remove
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
