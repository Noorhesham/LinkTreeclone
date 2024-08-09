"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal, PenIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
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
import CustomDialog from "@/app/components/CustomDialog";
import CreateProductForm from "@/app/components/CreateProductForm";
import { ImBin2 } from "react-icons/im";
import { deleteProduct } from "@/app/linkActions/actions";
//@ts-ignore
export const columns: ColumnDef<any>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value: any) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: any) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "image",
    header: "",
    cell({ row }) {
      //@ts-ignore
      return (
        <div className=" relative w-12 h-12  rounded-lg">
          <Image
            //@ts-ignore
            src={row.getValue("image")?.[0]?.secure_url}
            className=" rounded-lg object-cover"
            fill
            alt="product image"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Product Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell({ row }) {
      return <div className=" text-left font-medium">{row.getValue("name")}</div>;
    },
  },
  ,
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell({ row }) {
      return <div className=" text-left font-medium">{row.getValue("price")}</div>;
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Created At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell({ row }) {
      return <div className=" text-left font-medium">{new Date(row.getValue("createdAt")).toLocaleDateString()}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const product = row.original;
      console.log(product);
      {
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
                  }
                }}
              />
              <DropdownMenuItem>View payment details</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      }
    },
  },
];
