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
import { z } from "zod";
import CustomDialog from "./CustomDialog";

// Define the userName schema with validation rules
const userNameschema = z.object({
  userName: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long." })
    .regex(/^[a-zA-Z0-9]+$/, {
      message: "Username can only contain English letters and numbers without spaces or special characters.",
    }),
});

type InputFieldType = "bio" | "userName" | "phone";

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
    resolver: async (data) => {
      if (fieldType === "userName") {
        try {
          userNameschema.parse(data);
        } catch (e) {
          return {
            values: data,
            errors: {
              userName: { message: e.errors[0].message },
            },
          };
        }
      }
      return { values: data, errors: {} };
    },
  });

  const router = useRouter();
  const { control, handleSubmit } = form;
  const [isPending, startTransition] = useTransition();
  const onSubmit = (data: any) => {
    startTransition(async () => {
      const res: any = await updateUserDetails({ [fieldType]: data[fieldType] });
      if (res.success) {
        toast.success(res.success);
        router.refresh();
      } else {
        toast.error(res.error);
      }
    });
  };
  form.watch([fieldType]);
  return (
    <div className={`w-full flex  ${fieldType === "userName" ? "items-start" : "items-center"}  self-center mx-auto`}>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-row w-full items-center gap-2 px-5 py-2">
          <div
            className={` ${
              fieldType === "userName" ? "items-start" : "items-center"
            } flex  flex-row justify-between w-full gap-4`}
          >
            <FormField
              control={control}
              name={fieldType}
              render={({ field }) => (
                <div className="flex flex-col items-start w-full">
                  <FormItem
                    className={` ${
                      disablee ? " cursor-not-allowed" : ""
                    } w-[100%] mt-2 inline-flex h-[2rem] md:h-[3.1rem] overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 flex-col text-left items-start relative`}
                  >
                    <div
                      className={`  ${
                        disablee ? " cursor-not-allowed" : ""
                      } relative w-[100%] inline-flex items-center justify-center`}
                    >
                      <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                      <FormControl className={`  ${disablee ? " cursor-not-allowed" : ""} `}>
                        <Input
                          className={` ${
                            disablee ? " cursor-not-allowed" : ""
                          }  inline-flex h-[1.8rem] disabled:opacity-100 md:h-[2.9rem] w-full cursor-pointer items-center justify-center rounded-full disabled:bg-slate-900 bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl`}
                          {...field}
                          disabled={disablee}
                          placeholder={
                            fieldType === "bio"
                              ? t("inputUserName.addBioPlaceholder")
                              : fieldType === "phone"
                              ? t("inputUserName.phone")
                              : t("inputUserName.addUserNamePlaceholder")
                          }
                        />
                      </FormControl>
                    </div>
                  </FormItem>
                  {fieldType === "userName" && !disablee && (
                    <div className="text-sm mt-4 text-gray-200 ">
                      <p className="mb-1">Username must:</p>
                      <ul className="list-disc pl-5">
                        <li>Be at least 3 characters long.</li>
                        <li>Only contain English letters and numbers.</li>
                        <li>Not contain spaces or special characters.</li>
                      </ul>
                    </div>
                  )}
                  <FormMessage className="text-red-500 mt-1" />
                </div>
              )}
            />
            {!disablee ? (
              fieldType === "userName" ? (
                <CustomDialog
                  save={false}
                  title="Confirm Username"
                  content={
                    <div className="flex flex-col items-center gap-3">
                      <h2>Are you sure you want to change your username ?</h2>
                      <p>THIS ACTION CANNOT BE UNDONE </p>
                      <Button onClick={form.handleSubmit(onSubmit)}>Submit</Button>
                    </div>
                  }
                  btn={
                    <Button2
                      className=" rounded-full text-gray-50 bg-violet-400 hover:bg-violet-500 mt-3"
                      disabled={form.formState.errors?.userName || form.getValues("userName")?.length < 3}
                      type="button"
                    >
                      {" "}
                      Confirm UserName ?
                    </Button2>
                  }
                />
              ) : (
                <Button
                  className={`mb-auto `}
                  text={
                    fieldType === "bio"
                      ? t("inputUserName.addBioButton")
                      : fieldType === "phone"
                      ? t("inputUserName.phone")
                      : t("inputUserName.addUserNameButton")
                  }
                  disabled={isPending}
                />
              )
            ) : (
              <Button2 className=" rounded-full self-center py-4 px-8 my-auto" type="button" variant={"outline"}>
                <Link href={`${value}`}>{t("inputUserName.viewProfileButton")}</Link>
              </Button2>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default InputUserName;
