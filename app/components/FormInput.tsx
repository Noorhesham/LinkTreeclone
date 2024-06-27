"use client";
import React, { ReactNode, useState } from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const FormInput = ({ control, name, placeholder }: { control: any; name: string; placeholder: string }) => {
  return (
    <>
      <FormField
        control={control}
        name={name} 
        render={({ field }) => (
          <FormItem className="flex text-lg w-full flex-col gap-2 text-left items-start  relative">
            <FormControl>
              <Input defaultValue={field.value} placeholder={placeholder} {...field} className={` w-full `} />
            </FormControl>
            <FormMessage className=" text-sm dark:text-red-500" />
          </FormItem>
        )}
      />
    </>
  );
};

export default FormInput;
