"use client";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Button from "./Button";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { updateUserDetails } from "../linkActions/actions";
import Link from "next/link";
import { Button as Button2 } from "@/components/ui/button";

type InputFieldType = "bio" | "userName";

interface InputUserNameProps {
  id: string;
  value: string;
  fieldType: InputFieldType;
  disablee: boolean;
}

const InputUserName = ({ disablee, id, value, fieldType }: InputUserNameProps) => {
  const t = useTranslations();
  const form = useForm({
    defaultValues: {
      [fieldType]: value || "",
    },
  });
  const router = useRouter();
  const { control, handleSubmit } = form;
  const [isPending, startTransition] = useTransition();
  const onSubmit = (data: any) => {
    startTransition(async () => {
      const res: any = await updateUserDetails({ [fieldType]: data[fieldType] }, id);
      if (res.success) {
        toast.success(res.success);
        router.refresh();
      } else {
        toast.error(res.error);
      }
    });
  };
  return (
    <div className="w-full flex items-center self-center mx-auto">
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-row w-full items-center gap-2 px-5 py-2">
          <div className="flex items-center flex-row justify-between w-full gap-4">
            <FormField
              control={control}
              name={fieldType}
              render={({ field }) => (
                <FormItem
                  className={` ${
                    disablee ? " cursor-not-allowed" : ""
                  } w-[100%] mt-2 inline-flex h-[2rem] md:h-[3.1rem] overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 flex-col text-left items-start relative`}
                >
                  <div className={`  ${disablee ? " cursor-not-allowed" : ""} relative w-[100%] inline-flex items-center justify-center`}>
                    <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                    <FormControl className={`  ${disablee ? " cursor-not-allowed" : ""} `}>
                      <Input
                        className={` ${
                          disablee ? " cursor-not-allowed" : ""
                        }  inline-flex h-[1.8rem] disabled:opacity-100 md:h-[2.9rem] w-full cursor-pointer items-center justify-center rounded-full disabled:bg-slate-900 bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl`}
                        {...field} disabled={disablee}
                        placeholder={
                          fieldType === "bio"
                            ? t("inputUserName.addBioPlaceholder")
                            : t("inputUserName.addUserNamePlaceholder")
                        }
                      />
                    </FormControl>
                  </div>
                  <FormMessage className="text-sm dark:text-red-500" />
                </FormItem>
              )}
            />
            {!disablee ? (
              <Button
                className={`mt-auto `}
                text={fieldType === "bio" ? t("inputUserName.addBioButton") : t("inputUserName.addUserNameButton")}
                disabled={isPending}
              />
            ) : (
              <Button2 type="button" variant={"outline"}>
                <Link href={`/profile/${value}`}>{t("inputUserName.viewProfileButton")}</Link>
              </Button2>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default InputUserName;
