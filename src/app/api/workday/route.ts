import { prisma } from "@/service/prisma";
import { WeekDay } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const weekDay = [
  WeekDay.Sunday,
  WeekDay.Monday,
  WeekDay.Tuesday,
  WeekDay.Wednesday,
  WeekDay.Thursday,
  WeekDay.Friday,
  WeekDay.Saturday,
];

export async function GET(request: NextRequest) {
  try {
    const companyId = request.nextUrl.searchParams.get("companyId");

    if (!companyId)
      return NextResponse.json(
        { message: "Company Id is required!" },
        { status: 500 }
      );

    const response = await prisma.team.findMany({
      where: { companyId },
      select: {
        workDay: true,
        _count: {
          select: {
            teamUsers: true,
          },
        },
      },
    });

    const workDaysWithAssignedTo = response.flatMap((team) =>
      team.workDay.map((workDay) => ({
        ...workDay,
        assignedTo: team._count.teamUsers ?? 0,
      }))
    );

    // [ { workDay: [ [Object] ], _count: { teamUsers: 2 } } ]
    return NextResponse.json(workDaysWithAssignedTo);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { teamId, name, workWeek, weekOff, startOfWeek } =
      await request.json();

    // 🛡️ Validate required fields
    if (!teamId || !name || !workWeek || !weekOff || !startOfWeek) {
      return NextResponse.json(
        { message: "All fields are required!" },
        { status: 400 }
      );
    }

    const sowIndex = weekDay.findIndex((day) => {
      return startOfWeek.toLowerCase() == day.toLowerCase();
    });

    const wW = weekDay.filter((day) =>
      weekOff.map((day) => day.toLowerCase()).includes(day.toLowerCase())
    );

    // 🛠️ Create Workday Entry
    const workDay = await prisma.workday.create({
      data: {
        name,
        startOfWeek: weekDay[sowIndex],
        workWeek: parseInt(workWeek, 10),
        teamId,
        weekOff: wW as WeekDay[],
      },
    });

    return NextResponse.json(workDay);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "An error occurred while creating the workday entry." },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, teamId, name, workWeek, weekOff, startOfWeek } =
      await request.json();

    if (!id || !teamId || !name || !workWeek || !weekOff || !startOfWeek)
      return NextResponse.json(
        { message: "All fields are required!" },
        { status: 400 }
      );

    const sowIndex = weekDay.findIndex((day) => {
      return startOfWeek.toLowerCase() == day.toLowerCase();
    });

    const wW = weekDay.filter((day) =>
      weekOff.map((day) => day.toLowerCase()).includes(day.toLowerCase())
    );

    const workDay = await prisma.workday.update({
      where: { id },
      data: {
        name,
        startOfWeek: weekDay[sowIndex],
        workWeek: parseInt(workWeek, 10),
        teamId,
        weekOff: wW as WeekDay[],
      },
    });

    return NextResponse.json(workDay);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id)
      return NextResponse.json({ message: "Id is required!" }, { status: 400 });

    await prisma.workday.delete({ where: { id } });

    return NextResponse.json({});
  } catch (error) {
    console.error(error);
    return NextResponse.json({ status: 500 });
  }
}
