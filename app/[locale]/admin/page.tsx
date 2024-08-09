import { auth } from "@clerk/nextjs/server";
import connect from "@/app/lib/db";
import User from "@/app/lib/models/userModel";
import { DataTable } from "@/app/components/DataTable";
import { columns } from "./Columns";

const page = async () => {
  const { userId } = auth();
  if (userId) {
    await connect();
    const user = await User.findOne({ clerkUserId: userId }).lean();
    //@ts-ignore
    if (!user.isAdmin) redirect("/");
  }
  const users = await User.find({}).lean();
 //@ts-ignore
  return <DataTable columns={columns} data={users} />;
};

export default page;
