import React, { useTransition } from "react";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ShoppingCart } from "lucide-react";
import CartItem from "./CartItem";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatPrice } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { useGetCart } from "../query/query";
import BabySpinner from "./BabySpinner";
import Button from "./Button";
import { handleOrder } from "../lib/actions/actions";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import AnimatedImage from "./AnimatedImage";
const CartItems = ({ items }: { items?: any[] }) => {
  const { data: cart, isLoading } = useGetCart();
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();
  if (isLoading) return <BabySpinner />;
  const itemss = items || cart;
  const itemsCount = itemss?.length;
  const cartTotal = itemss?.length > 0 ? itemss?.reduce((acc: number, item: any) => acc + item.price, 0) : 0;
  return (
    <Sheet>
      <SheetTrigger className="group  flex items-center ">
        <>
          {items ? (
            <Button>Order Details</Button>
          ) : (
            <ShoppingCart
              aria-hidden="true"
              className=" group-hover:text-gray-500 m-auto duration-200 h-6 w-6 flex-shrink-0 text-gray-400"
            />
          )}
          <span className=" ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">{itemsCount}</span>
        </>
      </SheetTrigger>
      <SheetContent className="flex flex-col w-full pr-0 sm:max-w-lg">
        <SheetHeader className=" space-y-2.5 pr-6">
          <SheetTitle>Cart ({itemsCount}) Items</SheetTitle>
        </SheetHeader>
        {itemsCount > 0 ? (
          <>
            <div className="flex flex-col  w-full pr-6">
              <ScrollArea className=" h-[30rem]">
                {itemss?.map((product: any, i: number) => (
                  <CartItem nodel={Boolean(items)} key={i} product={product} />
                ))}
                {/* {location && (
                  <div className="space-y-4 ">
                    <h1 className="text-xl font-semibold">Delivery Location</h1>
                    <p className="text-sm text-muted-foreground">{address}</p>
                    <div className=" max-w-3xl h-60">
                      <MapComponent defaultLocation={location} />
                    </div>
                  </div>
                )} */}
              </ScrollArea>
            </div>
            <div className=" space-y-4 pr-6">
              <Separator />
              <div className=" space-y-1.5 text-sm">
                <div className="flex">
                  <span className="flex-1">Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex">
                  <span className="flex-1">Total</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
              </div>
            </div>
            <Button
              onClick={() => {
                startTransition(async () => {
                  const res = await handleOrder();
                  if (res.success) {
                    toast.success(res.success);
                    queryClient.invalidateQueries({ queryKey: ["cart"] });
                  }
                });
              }}
            >
              Place Order
            </Button>
          </>
        ) : (
          <div className="flex flex-col w-full h-full gap-10  items-center justify-center space-y-1">
            <div className=" relative  text-muted-foreground">
              <AnimatedImage className=" h-80 w-80" data={"Animation - 1723233194864.json"} />
            </div>
            <div className=" w-full flex flex-col items-center gap-2">
              <div className=" capitalize text-xl font-semibold ">Your cart is empty ! 😸</div>
              <SheetTrigger asChild>
                <Link
                  className={buttonVariants({
                    className: " capitalize text-sm  text-amber-500 hover:text-amber-400 text-muted-foreground",
                    variant: "link",
                    size: "sm",
                  })}
                  href="/products"
                >
                  add items to your cart to check out
                </Link>
              </SheetTrigger>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartItems;
