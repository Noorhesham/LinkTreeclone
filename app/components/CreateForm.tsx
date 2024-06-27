"use client";
import React, { useEffect, useTransition, useState } from "react";
import Button from "./Button";
import { PlusIcon } from "lucide-react";
import LinkForm from "./LinkForm";
import { deleteLink } from "../linkActions/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const CreateForm = ({ userId, links }: { userId: string; links: { link: string; provider: string ,_id:string}[] }) => {
  const [linkList, setLinkList] = useState(links);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDeleteLink = (id: string) => {
    setLinkList((prev) => prev.filter((link) => link._id !== id));
    startTransition(async () => {
      if (!id) return;
      const res: any = await deleteLink(id);
      if (res.success) toast.success(res.success);
      if (res.error) toast.error(res.error);
    });
    router.refresh();
  };

  useEffect(() => {
    setLinkList(links);
  }, [links]);

  const handleAddLink = () => {
    setLinkList([...linkList, { link: "", provider: "", _id: "" }]);
  };

  return (
    <div className="max-w-5xl min-w-[550px]  rounded-2xl mx-auto px-8 py-4">
      <Button onClick={handleAddLink} className="flex items-center w-full gap-5">
        <PlusIcon /> Add Link
      </Button>
     <div className="flex items-center mt-5 gap-3 flex-col">
     {linkList.map((link, index) => (
        <LinkForm
          key={index}
          userId={userId}
          linkData={link}
          handleDeleteLink={handleDeleteLink}
        />
      ))}
      </div>
    </div>
  );
};

export default CreateForm;
