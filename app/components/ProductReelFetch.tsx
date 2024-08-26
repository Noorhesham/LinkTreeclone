import React from "react";
import ProductCard from "./ProductCard";
import { unstable_cache } from "next/cache";
import { getProducts } from "../lib/actions/actions";

const fetchProducts = async () => {
  return await getProducts();
};

// Wrapping the cache around the fetch function
const cachedFetchProducts = unstable_cache(fetchProducts, ["products"], { revalidate: 60 });

const ProductReelFetch = async ({ user }: { user: any }) => {
  // Use the cached function to fetch products
  const res = await cachedFetchProducts();

  if (!res || !res.data) {
    return null; // Handle the case where the response is invalid or empty
  }

  const { products } = res.data;

  return (
    <>
      {products.length > 0 && (
        <>
          {products.map((product: any, i: number) => (
            <ProductCard username={user?.userName} index={i} key={product.id} product={product} />
          ))}
          {products.length < 12 &&
            Array.from({ length: 12 - products.length }).map((_, i) => (
              <div className="lg:block hidden w-full h-full min-h-20" key={i}>
                {" "}
              </div>
            ))}
        </>
      )}
    </>
  );
};

export default ProductReelFetch;
