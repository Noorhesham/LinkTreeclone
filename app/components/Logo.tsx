import Image from "next/image";
import React from "react";

const Logo = () => {
  return (
    <div className=" w-36 h-36 relative">
      <Image src="/VEGA.png" alt="VEGA" fill />
    </div>
  );
};

export default Logo;
