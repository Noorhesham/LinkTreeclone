"use client";
import Lottie from "lottie-react";
import React, { useEffect, useState } from "react";
import { CgSpinner } from "react-icons/cg";
const AnimatedImage = ({ data, className }: { data?: any; className?: string }) => {
  const [animationData, setAnimationData] = useState<any>();

  useEffect(() => {
    import(`../data/${data ? data : "animate1.json"}`).then(setAnimationData);
  }, []);
  if (!animationData) return <CgSpinner className="animate-spin " />;
  return (
    <div className={`${className || "max-w-[50%]"}`}>
      <Lottie animationData={animationData} />
    </div>
  );
};

export default AnimatedImage;
