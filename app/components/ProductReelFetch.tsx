import React from "react";
import ProductCard from "./ProductCard";
import { unstable_cache } from "next/cache";
import { getProducts } from "../lib/actions/actions";

const ProductReelFetch = async () => {
  const res = await unstable_cache(async () => await getProducts(), ["products"])();
  if (!res) return null;
  const { products } = res.data;
  return (
    <>
      {products.length > 0 && (
        <>
          {products.map((product: any, i: number) => (
            <ProductCard index={i} key={product.id} product={product} />
          ))}
          {products.length < 12 &&
            Array.from({ length: 12 - products.length }).map((_, i) => (
              <div className=" lg:block hidden w-full h-full min-h-20" key={i}>
                {" "}
              </div>
            ))}
        </>
      )}
    </>
  );
};

export default ProductReelFetch;
