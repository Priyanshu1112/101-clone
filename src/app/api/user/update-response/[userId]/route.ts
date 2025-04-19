import { prisma } from "@/service/prisma";
import { UpdateResponseStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }) {
  try {
    const { userId } = await params;

    if (!userId) {
      return NextResponse.json(
        { message: "User id is requried!" },
        { status: 400 }
      );
    }

    const updateResponse = await prisma.updateResponse.findMany({
      where: { userId },
      include: {
        update: { select: { id: true, questions: true, time: true } },
      },
    });

    return NextResponse.json(updateResponse);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Unexpected error occured!",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }) {
  try {
    const { answer, updateResponseId } = await request.json();
    const { userId } = await params;

    if (!answer || !userId || !updateResponseId)
      return NextResponse.json(
        { message: "All the fields are requried!" },
        { status: 400 }
      );

    const status = answer.some((data) => data == "")
      ? UpdateResponseStatus.Incomplete
      : UpdateResponseStatus.Complete;

    await prisma.updateResponse.update({
      where: { id: updateResponseId },
      data: {
        answer,
        status,
      },
    });

    return NextResponse.json({});
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Unexpected error occured!",
      },
      { status: 500 }
    );
  }
}
