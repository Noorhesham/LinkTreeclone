"use client";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { updateBio } from "../linkActions/actions";
import Button from "./Button";
import { useRouter } from "next/navigation";

const InputUserName = ({id,bio}:{id:string,bio?:string}) => {
  const form = useForm({
    defaultValues: {
      bio:bio|| "",
    },
  });
  const router = useRouter();
  const { control, handleSubmit } = form;
  const [isPending, startTransition] = useTransition();
  const onSubmit = (data: any) => {
    startTransition(async () => {
      const res: any = await updateBio(data,id);
      if (res.success) {
        toast.success(res.success);
        router.refresh();
      } else {
        toast.error(res.error);
      }
    });
  };
  return (
    <div className="w-full self-center mx-auto">
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex w-full items-center gap-8 px-5 py-4">
          <div className="flex items-center justify-between w-full gap-4">
            <FormField
              control={control}
              name="bio"
              render={({ field }) => (
                <FormItem className=" w-[100%] mt-5 inline-flex h-[3.1rem] overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 flex-col text-left items-start  relative">
                  <div className={`relative w-[100%]  inline-flex items-center justify-center `}>
                    <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />

                    <FormControl className="">
                      <Input
                        className="inline-flex  h-[2.9rem] w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl"
                        {...field}
                        name="userName"
                        placeholder="link::// Enter User Name"
                      />
                    </FormControl>
                  </div>
                  <FormMessage className=" text-sm dark:text-red-500" />
                </FormItem>
              )}
            />
          <Button className=" mt-auto" text="Add Bio" disabled={isPending} />
          </div>
        </form>
      </Form>
    </div>
  );
};

export default InputUserName;
