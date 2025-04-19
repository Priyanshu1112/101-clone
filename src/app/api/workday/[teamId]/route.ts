import { prisma } from "@/service/prisma";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const { teamId } = await params;

    if (!teamId)
      return NextResponse.json(
        { message: "Team Id is required!" },
        { status: 500 }
      );

    const workDay = await prisma.workday.findFirst({ where: { teamId } });

    return NextResponse.json(workDay);
  } catch (error) {
    console.error(error);

    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
  }
}
