import * as React from "react";
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from "@/components/ui/select";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { socialMediaPlatforms } from "../constants";
import { useThemes } from "../context/ThemeProvider";

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
  const {theme}=useThemes()
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={`card-${theme}`}>
          <Select 
            onValueChange={(val) => {
              setImage(val);
              field.onChange(val);
            }}
            defaultValue={defaultProvider || value || field.value}
          >
            <FormControl>
              <SelectTrigger className={`card-${theme}`}>
                <SelectValue className={`card-${theme}`} placeholder="Select a platform" />
              </SelectTrigger>
            </FormControl>
            <SelectContent className={`card-${theme}`}>
              {socialMediaPlatforms
                .map((platform) => (
                  <SelectItem className={`card-${theme}`} key={platform} value={platform}>
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
