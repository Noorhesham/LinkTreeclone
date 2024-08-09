import MaxWidthWrapper from "@/app/components/MaxWidthWrapper";
import ProductReel from "@/app/components/ProductReel";
import React from "react";

const page = () => {
  return (
    <MaxWidthWrapper className=" py-10 px-20">
      <ProductReel title="Vega Shop" />
    </MaxWidthWrapper>
  );
};

export default page;
