import Product from "@/app/lib/models/ProductModel";
import React from "react";
import { columns } from "./Columns";
import { DataTable } from "@/app/components/DataTable";
import CustomDialog from "@/app/components/CustomDialog";
import CreateProductForm from "@/app/components/CreateProductForm";
import Button from "@/app/components/Button";
import { deleteProduct } from "@/app/linkActions/actions";

const page = async () => {
  const products = await Product.find({}).lean();
  console.log(products);
  return (
    <section className=" flex flex-col  mt-5">
      <CustomDialog
        btn={<Button className="text-gray-50  self-end">Add Product</Button>}
        title="Add Product"
        content={<CreateProductForm />}
      />
      <DataTable handleDeleteAll={deleteProduct} columns={columns} data={products} />;
    </section>
  );
};

export default page;
