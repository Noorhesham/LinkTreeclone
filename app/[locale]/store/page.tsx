import MaxWidthWrapper from "@/app/components/MaxWidthWrapper";
import ProductReel from "@/app/components/ProductReel";
import React from "react";

const page = () => {
  return (
    <MaxWidthWrapper className=" px-8 py-4 lg:py-10 lg:px-20">
      <ProductReel title="Vega Shop" />
    </MaxWidthWrapper>
  );
};

export default page;
