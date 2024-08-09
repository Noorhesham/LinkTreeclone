"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Delete } from "@/app/components/Delete";
import { deactivateUser } from "@/app/linkActions/actions";
import { toast } from "react-toastify";
import ToggleMode from "@/app/components/ToggleMode";

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
    accessorKey: "photo",
    header: "Photo",
    cell({ row }) {
      //@ts-ignore
      return (
        <div className=" relative w-12 h-12 rounded-full">
          <Image src={row.getValue("photo")} className="rounded-full object-cover" fill alt="product image" />
        </div>
      );
    },
  },
  {
    accessorKey: "userName",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          User Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell({ row }) {
      return <div className=" text-left font-medium">{row.getValue("userName")}</div>;
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell({ row }) {
      return <div className=" text-left text-muted-foreground font-medium">{row.getValue("email")}</div>;
    },
  },
  {
    accessorKey: "firstName",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell({ row }) {
      console.log(row.original);
      return (
        <div className=" font-medium text-left">
          {row.original.firstName + " " + (row.original.lastName ? row.original.lastName : "")}
        </div>
      );
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
      const user = row.original;
      {
        return (
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">Change activity status</p>
            <ToggleMode user={user} />
          </div>
        );
      }
    },
  },
];
