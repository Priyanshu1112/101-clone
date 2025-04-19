import { prisma } from "@/service/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }) {
  try {
    const { companyId } = await params;

    if (!companyId)
      return NextResponse.json(
        { message: "Company id is required!" },
        { status: 400 }
      );

    const updates = await prisma.update.findMany({
      where: { companyId },
      include: {
        // team: { select: { id: true, name: true, logo: true } },
        members: { select: { id: true } },
      },
    });

    return NextResponse.json(updates);
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { message: "Unexpected error occurred" },
      { status: 500 }
    );
  }
}
