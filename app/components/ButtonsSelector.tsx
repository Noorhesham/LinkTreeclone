"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import React, { useState, useTransition } from "react";
import { updateButtons } from "../linkActions/actions";
import { toast } from "react-toastify";
import { useButtons } from "../context/ButtonProvider";

const ButtonsSelector = () => {
  const { color, setBorder, border, setColor } = useButtons();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const handleClick = () => {
    startTransition(async () => {
      const res: any = await updateButtons({
        border,
        color,
      });
      if (res.success) {
        toast.success(res.success);
        router.refresh();
      } else {
        toast.error(res.error);
      }
    });
  };
  return (
    <div className="flex flex-col  font-semibold text-sm md:text-xl  gap-4">
      <div className="flex px-4 py-2 flex-col items-center space-y-3 gap-2">
        <h2 className="text-xs text-gray-50">Border Radius</h2>
        <Slider value={[border]} onValueChange={(e) => setBorder(e[0])} defaultValue={[0]} max={20} step={1} />
      </div>
      <div className="flex px-4 py-2 flex-col space-y-3 gap-5">
        <h2 className="text-xs text-gray-50">Button Color</h2>
        <div className="flex items-center  justify-between px-3 py-1.5">
          <Input type="color" value={color} onChange={(e) => setColor(e.target.value)} className=" w-[40%] py-3 px-6" />
          <Button
            variant={"outline"}
            onClick={() => {
              setColor("");
              setBorder(100);
              handleClick();
            }}
          >
            Reset Color To Default
          </Button>
        </div>
      </div>
      <Button
        className={cn("w-full text-gray-50")}
        style={{
          borderRadius: `${border}px`,
          backgroundColor: color,
        }}
      >
        Adjust Your Button
      </Button>
      <Button className=" ml-auto mt-5" variant={"outline"} onClick={() => handleClick()}>
        Submit {isPending && "ing..."}
      </Button>
    </div>
  );
};

export default ButtonsSelector;
