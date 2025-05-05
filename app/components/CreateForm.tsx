"use client";
import React, { useEffect, useTransition, useState } from "react";
import Button from "./Button";
import { PlusIcon } from "lucide-react";
import LinkForm from "./LinkForm";
import { deleteLink, updateOrderLinks } from "../linkActions/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Reorder } from "framer-motion";
import { useTranslations } from "next-intl";

const CreateForm = ({
  userId,
  links,
}: {
  userId: string;
  links: { link: string; provider: string; _id: string }[];
}) => {
  const [linkList, setLinkList] = useState(links);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const t = useTranslations();
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

  const handleReorder = async (newItems: any[]) => {
    setLinkList(newItems);
    startTransition(async () => {
      const res = await updateOrderLinks(newItems);
      if (res.success) toast.success(res.success);
      if (res.error) toast.error(res.error);
      router.refresh();
    });
  };
  console.log(linkList);
  return (
    <div className={` max-w-5xl w-full flex flex-col lg:min-w-[550px] rounded-2xl mx-auto px-4 md:px-8 py-2 md:py-4`}>
      <div className="flex items-center gap-3 flex-col">
        <Reorder.Group
          axis="y"
          className="flex flex-col w-full md:w-[80%] gap-4"
          values={linkList}
          onReorder={handleReorder}
        >
          {linkList?.map((link, index) => (
            <LinkForm key={link._id || index} userId={userId} linkData={link} handleDeleteLink={handleDeleteLink} />
          ))}
        </Reorder.Group>
      </div>
      <Button onClick={handleAddLink} className="flex mt-5 items-center w-[50%] mx-auto self-center gap-5">
        <PlusIcon /> {t("createForm.addLinkButton")}
      </Button>
    </div>
  );
};

export default CreateForm;
