import Product from "@/app/lib/models/ProductModel";
import React from "react";
import { columns } from "./Columns";
import { DataTable } from "@/app/components/DataTable";
import CustomDialog from "@/app/components/CustomDialog";
import CreateProductForm from "@/app/components/CreateProductForm";
import Button from "@/app/components/Button";
import { deleteOrder } from "@/app/linkActions/actions";
import Order from "@/app/lib/models/Order";
import connect from "@/app/lib/db";
import { auth } from "@clerk/nextjs/server";
import User from "@/app/lib/models/userModel";
import MaxWidthWrapper from "@/app/components/MaxWidthWrapper";

const page = async () => {
  const { userId } = await auth();
  await connect();
  const user = await User.findOne({ clerkUserId: userId }).lean();
  const orders = await Order.find({ customer: user._id }).lean();
  console.log(orders);
  return (
    <MaxWidthWrapper className=" py-20 flex flex-col  mt-5">
      <DataTable columns={columns} data={orders} />
    </MaxWidthWrapper>
  );
};

export default page;
