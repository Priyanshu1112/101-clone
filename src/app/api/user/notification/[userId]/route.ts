import { prisma } from "@/service/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    const notifications = await prisma.notification.findMany({
      where: { for: { has: userId } },
    });

    return NextResponse.json(notifications);
  } catch (error) {
    return NextResponse.json({
      message:
        error instanceof Error ? error.message : "Unexpected error occured!",
      status: 500,
    });
  }
}
