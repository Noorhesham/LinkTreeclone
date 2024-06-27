import React from "react";

const LargeHeading = ({
  text,
  paragraph,
  className,
  heighlight,
  colorful,
}: {
  text: string;
  paragraph?: string;
  className?: string;
  heighlight?: string;
  colorful: string;
}) => {
  return (
    <div className=" flex z-20  capitalize flex-col items-center lg:items-start lg:gap-2">
      {<h2 className=" text-2xl dark:text-gray-50 ">{heighlight}</h2>}
      <h1
        className={`  z-20  text-gray-50 font-bold  text-3xl  leading-relaxed  lg:text-5xl  ${
          className || "xl:text-7xl"
        }`}
      >
        {text}{" "}
        <span className="   after:z-10  relative after:-rotate-6  text-purple-500 after:border-t-[6px] after:absolute after:h-4 after:w-full  after:left-0 after:-bottom-5  after:border-t-1 after:rounded-[50%] ">
          {colorful}
        </span>
      </h1>
      <p className=" relative  z-20 mt-8 dark:text-gray-400 text-muted-foreground  leading-7"> {paragraph} </p>
    </div>
  );
};

export default LargeHeading;
