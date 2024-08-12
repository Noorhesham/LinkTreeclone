import React from "react";
import { Delete } from "@/app/components/Delete";
import { toast } from "react-toastify";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PenIcon } from "lucide-react";

import CustomDialog from "@/app/components/CustomDialog";
import CreateProductForm from "@/app/components/CreateProductForm";
import { ImBin2 } from "react-icons/im";
import { deleteProduct } from "@/app/linkActions/actions";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import CartItems from "./CartItems";
const Actions = ({ product, sheet }: { product: any; sheet?: boolean }) => {
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>

        <CustomDialog
          title="Update product"
          btn={
            <Button className="flex justify-between w-full   hover:text-green-400 duration-150">
              Edit <PenIcon className="h-4 w-4 ml-auto" />
            </Button>
          }
          content={<CreateProductForm product={product} />}
        />

        <DropdownMenuSeparator />

        <Delete
          btn={
            <div className="flex px-3 py-1.5 hover:bg-gray-100 duration-150 justify-between cursor-pointer">
              Delete{" "}
              <span className=" hover:text-amber-500  my-auto  self-center cursor-pointer text-amber-400 duration-200  ">
                <ImBin2 />
              </span>
            </div>
          }
          value={product.name}
          onClick={async () => {
            const res = await deleteProduct(product._id);
            if (res.success) {
              toast.success(res.success);
              router.refresh();
            }
          }}
        />
        {sheet && <CartItems items={product.product} />}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Actions;
