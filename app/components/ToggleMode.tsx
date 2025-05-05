import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "react-toastify";
import { deactivateUser } from "../linkActions/actions";

const ToggleMode = ({ user }: { user: any }) => {
  const router = useRouter();
  return (
    <Checkbox
      checked={user.active == false ? false : true}
      onCheckedChange={async (e:boolean) => {
        const res = await deactivateUser(user.clerkUserId, e);
        if (res.success) toast.success(res.success);
        else toast.error(res.error);
        router.refresh();
      }}
      aria-label="Select row"
    />
  );
};

export default ToggleMode;
