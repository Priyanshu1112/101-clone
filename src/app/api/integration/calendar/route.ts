import { prisma } from "@/service/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  try {
    const { userId, googleNotification } = await request.json();

    if (!userId) {
      return NextResponse.json({ message: "User id is required" });
    }

    let updateBody = {};

    if ([true, false].includes(googleNotification))
      updateBody = { ...updateBody, googleNotification };

    const user = await prisma.user.update({
      where: { id: userId },
      data: { ...updateBody },
    });

    return NextResponse.json(user);
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
