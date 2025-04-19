import { prisma } from "@/service/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { params }: { params: Promise<any> }
) {
  try {
    const { companyId } = await params;

    if (!companyId) {
      return NextResponse.json(
        { message: "Company Id is required!" },
        { status: 400 }
      );
    }

    const calendar = await prisma.calendar.findMany({
      where: { companyId },
      include: {
        holiday: { select: { occasion: true, date: true } },
        team: {
          select: {
            name : true,
            teamUsers: {
              include: {
                user: {
                  select: { id: true, name: true, email: true },
                },
              },
            },
          },
        },
        _count: {
          select: { holiday: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const newCalendar = calendar.map((data) => {
      const totalMembers = data.team?.teamUsers.length ?? 0;

      return {
        ...data,
        assignedTo: totalMembers,
      };
    });

    return NextResponse.json(newCalendar);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
