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

const page = async () => {
  await connect();
  const orders = await Order.find({}).lean();
  console.log(orders);
  return (
    <section className=" flex flex-col  mt-5">
      <CustomDialog
        btn={<Button className="text-gray-50  self-end">Add Product</Button>}
        title="Add Product"
        content={<CreateProductForm />}
      />
      <DataTable handleDeleteAll={deleteOrder} columns={columns} data={orders} />
    </section>
  );
};

export default page;
