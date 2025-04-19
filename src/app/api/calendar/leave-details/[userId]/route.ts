import { prisma } from "@/service/prisma";
import dayjs from "dayjs";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const { userId } = await params;

    if (!userId) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 500 }
      );
    }

    const latestLeave = await prisma.leaveRecord.findFirst({
      where: {
        userId,
        status: "APPROVED",
        start: {
          lte: dayjs().format('YYYY-MM-DD'),
        },
      },
      orderBy: {
        start: "desc",
      },
    });

    // Get tomorrow's month and day in MM-DD format
    const tomorrowMonthDay = dayjs().add(1, "day").format("MM-DD");

    const userWithTeams = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        teamUsers: {
          select: {
            team: {
              select: {
                calendar: {
                  select: {
                    holiday: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const holidays = userWithTeams?.teamUsers.flatMap((teamUser) =>
      teamUser.team.calendar.flatMap((calendar) => calendar.holiday)
    );

    // Find upcoming holiday starting from tomorrow
    const upcomingHoliday = holidays
      ?.filter((holiday) => {
        const holidayMonthDay = dayjs(holiday.start).format("MM-DD");
        return holidayMonthDay > tomorrowMonthDay;
      })
      .sort((a, b) => {
        const dateA = dayjs(a.start).format("MM-DD");
        const dateB = dayjs(b.start).format("MM-DD");
        return dateA.localeCompare(dateB);
      })[0];

    return NextResponse.json({ latestLeave, upcomingHoliday });
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { message: "An unknown error occurred" },
      { status: 500 }
    );
  }
}
