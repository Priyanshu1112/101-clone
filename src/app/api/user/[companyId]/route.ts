import { prisma } from "@/service/prisma";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const { companyId } = await params;

    if (!companyId)
      return NextResponse.json(
        { message: "Company id is required!" },
        { status: 500 }
      );

    const users = await prisma.user.findMany({
      where: { companyId },
      include: {
        approver: { select: { id: true, name: true } },
        teamUsers: {
          select: {
            teamId: true,
            role: true,
            user: { select: { id: true, name: true } },
            team: {
              select: {
                id: true,
                name: true,
                workDay: { select: { workWeek: true } },
              },
            },
          },
        },
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ status: 500 });
  }
}
