import { prisma } from "@/service/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }) {
  try {
    const [teamId, userId] = (await params).slug;

    if (!teamId || !userId)
      return NextResponse.json(
        { message: "Both the ids are required!" },
        { status: 400 }
      );

    await prisma.teamUser.update({
      where: { teamId_userId: { teamId, userId } },
      data: { isArchive: true },
    });

    return NextResponse.json({});
  } catch (error) {
    console.error(error);
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 500 });
    return NextResponse.json(
      { message: "Unexpected error occured!" },
      { status: 500 }
    );
  }
}
