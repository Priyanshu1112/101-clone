import { prisma } from "@/service/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  try {
    const { type } = await params;

    const { day, time, channel, companyId } = await request.json();

    if (!["daily", "weekly"].includes(type) || !time || !channel || !companyId)
      return NextResponse.json(
        { message: "All fields are required!" },
        { status: 500 }
      );

    if (type != "daily" && !day)
      return NextResponse.json(
        { message: "All fields are required!" },
        { status: 500 }
      );

    const updateBody =
      type == "daily"
        ? { dailyLeaveSummary: { day, time, channel } }
        : { weeklyLeaveSummary: { day, time, channel } };

    const company = await prisma.company.update({
      where: { id: companyId },
      data: { ...updateBody },
    });

    return NextResponse.json(company);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Unexpected error occured!",
      },
      { status: 500 }
    );
  }
}
