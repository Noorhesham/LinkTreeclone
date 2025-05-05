"use client";
import React, { useEffect, useState } from "react";
import { CgSpinner } from "react-icons/cg";
import dynamic from "next/dynamic";

// Import Lottie dynamically with SSR disabled to avoid 'document is not defined' error
const Lottie = dynamic(() => import("lottie-react"), {
  ssr: false,
  loading: () => <CgSpinner className="animate-spin" />,
});

const AnimatedImage = ({ data, className }: { data?: string; className?: string }) => {
  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    // Only load animation data on client side
    import(`../data/${data || "animate1.json"}`)
      .then((data) => setAnimationData(data.default || data))
      .catch((err) => console.error("Failed to load animation:", err));
  }, [data]);

  if (!animationData) return <CgSpinner className="animate-spin" />;

  return (
    <div className={`${className || "max-w-[50%]"}`}>
      <Lottie animationData={animationData} />
    </div>
  );
};

export default AnimatedImage;
