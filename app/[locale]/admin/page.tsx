import React from "react";
import NFCWriter from "../../components/WriteNfc";
import MaxWidthWrapper from "@/app/components/MaxWidthWrapper";

const page = () => {
  return (
    <MaxWidthWrapper>
      <div className="flex justify-center items-center py-6 px-12 bg-background  text-xl mt-10 h-full w-full lg:min-h-[60vh]">
        <NFCWriter />
      </div>
    </MaxWidthWrapper>
  );
};

export default page;
