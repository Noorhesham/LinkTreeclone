import * as React from "react";
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from "@/components/ui/select";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { socialMediaPlatforms } from "../constants";

export function SelectDemo({
  control,
  name,
  value,
  setImage,
  defaultProvider,
}: {
  control: any;
  name: string;
  value?: string;
  setImage: any;
  defaultProvider: string;
}) {
  console.log(defaultProvider);
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <Select
            onValueChange={(val) => {
              setImage(val);
              field.onChange(val);
            }}
            defaultValue={defaultProvider || value || field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a platform" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {socialMediaPlatforms
                .map((platform) => (
                  <SelectItem key={platform} value={platform}>
                    {platform}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
