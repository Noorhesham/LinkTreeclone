// app/api/add-link.ts
import Link from "@/app/lib/models/linkModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { Obj, userId } = await req.json();
    const { link, platform } = Obj;
    console.log(Obj, userId);
    // Validation (optional)
    if (!link || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newlink = await Link.create({
      link,
      provider: platform,
      userId,
    });

    if (!link) {
      return NextResponse.json({ error: "Link not added!" }, { status: 500 });
    }

    const linkOBJ = JSON.parse(JSON.stringify(link));
    return NextResponse.json({ success: "Link added successfully!", status: 200, data: { linkOBJ } });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred while adding the link" }, { status: 500 });
  }
}
