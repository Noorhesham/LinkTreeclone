import React from "react";
import NavLink from "./NavLink";
import { IoHomeOutline } from "react-icons/io5";
import { MdOutlineProductionQuantityLimits, MdSell } from "react-icons/md";
import { BsPeople } from "react-icons/bs";
import { MdOutlineSell } from "react-icons/md";
import UserCard from "./View";
import { auth } from "@clerk/nextjs/server";
import connect from "../lib/db";
import User from "../lib/models/userModel";
import { ClipboardPenLineIcon } from "lucide-react";
const SideBar = async () => {
  const { userId } = await auth();
  console.log(userId);
  await connect();
  const user: any = await User.findOne({ clerkUserId: userId }).lean();
  console.log(user, userId);
  if (!user) return <h1>User not found</h1>;
  return (
    <section className="  lg:block hidden  h-full   text-left md:col-span-1 p-2 ">
      <div className="lg:flex  hidden h-full  flex-col items-center md:items-start md:ml-4 gap-2">
        <div className="flex flex-col items-center mx-auto ">{/* <Logo /> */}</div>
        <h4 className=" text-gray-400 md:text-xl text-sm ">Menu</h4>
        <NavLink href={`admin`} title="Users" icon={<IoHomeOutline />} />
        <NavLink href={`admin/products`} title="My Products" icon={<MdOutlineProductionQuantityLimits />} />
        <NavLink href={`admin/orders`} title="My Orders" icon={<MdOutlineProductionQuantityLimits />} />
        <NavLink href={`admin/card-ids`} title="Card Ids" icon={<ClipboardPenLineIcon />} />
      </div>
    </section>
  );
};

export default SideBar;
