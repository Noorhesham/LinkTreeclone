import React from "react";
import BabySpinner from "./BabySpinner";

const Button = ({
  text,
  className,
  children,
  onClick,
  disabled,
}: {
  text?: string;
  className?: string;
  children?: React.ReactNode;
  onClick?: any;
  disabled?: boolean;
}) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`relative text-base  min-w-[130px] md:min-w-[150px] inline-flex h-8 md:h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 ${
        className || ""
      }`}
    >
      <span className="absolute text-base inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
      <span className={`  inline-flex  gap-3 h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-1 md:px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl`}>
        {!disabled  && text}
        {disabled ? <BabySpinner /> :children}
      </span>
    </button>
  );
};

export default Button;
