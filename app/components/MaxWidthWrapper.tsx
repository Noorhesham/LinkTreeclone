import React from "react";

const MaxWidthWrapper = ({ className, children }: { className?: string; children: React.ReactNode }) => {
  return <div className={`max-w-screen-xl w-full mx-auto px-0 md:px-20 ${className||""}`}>{children}</div>;
};

export default MaxWidthWrapper;
