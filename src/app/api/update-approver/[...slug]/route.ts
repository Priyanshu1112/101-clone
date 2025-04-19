import { prisma } from "@/service/prisma";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const [memberId, approverId] = (await params).slug;

    if (!memberId || !approverId)
      return NextResponse.json(
        { message: "All fields are required!" },
        { status: 500 }
      );

    await prisma.user.update({ where: { id: memberId }, data: { approverId } });

    return NextResponse.json({});
  } catch (error) {
    console.error(error);

    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 500 });

    return NextResponse.json(
      { message: "Internal server error!" },
      { status: 500 }
    );
  }
}
