import * as React from "react";
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from "@/components/ui/select";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const socialMediaPlatforms = [
  "Facebook",
  "Twitter",
  "Instagram",
  "LinkedIn",
  "Snapchat",
  "TikTok",
  "YouTube",
  "WhatsApp",
  "Pinterest",
  "Reddit","Custom_Link"
];

export function SelectDemo({
  control,
  name,
  value,
  setImage,
}: {
  control: any;
  name: string;
  value?: string;
  setImage: any;
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Platform</FormLabel>
          <Select
            onValueChange={(val) => {
              setImage(val);
              field.onChange(val);
            }}
            defaultValue={value || field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a platform" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {socialMediaPlatforms.map((platform) => (
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
