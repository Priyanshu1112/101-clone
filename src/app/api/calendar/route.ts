import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/service/prisma";

export async function GET(request: NextRequest) {
  try {
    const calendarId = request.nextUrl.searchParams.get("calendarId");

    if (!calendarId)
      return NextResponse.json(
        { message: "Calendar Id is required!" },
        { status: 500 }
      );

    const calendar = await prisma.calendar.findUnique({
      where: { id: calendarId },
      select: {
        id: true,
        country: true,
        holiday: true, // Assuming holiday is an array of string dates
        calendarId: true,
        team: {
          select: {
            id: true,
            // leads: true,
            name: true,
            // _count: { select: { members: true } },
          },
        },
      },
    });

    if (calendar?.holiday) {
      // Sort holiday by date in ascending order
      calendar.holiday.sort((a, b) => {
        const [monthA, dayA] = a.date.split(" ");
        const [monthB, dayB] = b.date.split(" ");

        const dateA = new Date(`${monthA} ${dayA}`);
        const dateB = new Date(`${monthB} ${dayB}`);

        return dateA.getTime() - dateB.getTime();
      });
    }

    return NextResponse.json(calendar);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { calendar, holiday, companyId } = await request.json();

    if (!calendar || !holiday || !companyId)
      return NextResponse.json(
        { message: "All fields are required!" },
        { status: 500 }
      );

    const newCalendar = await prisma.calendar.create({
      data: {
        companyId,
        country: calendar.country,
        calendarId: calendar.id,
      },
      include: {
        team: {
          select: {
            teamUsers: {
              include: {
                user: { select: { id: true, name: true, email: true } },
              },
            },
          },
        },
      },
    });

    await Promise.all(
      holiday.map((data) =>
        prisma.holiday.create({
          data: {
            calendarId: newCalendar.id,
            occasion: data.occasion,
            date: data.date,
            start: data.start,
            end: data.end,
          },
        })
      )
    );

    // console.log({ calendar, holiday, companyId });

    return NextResponse.json({ newCalendar });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { calendarId, teamId } = await request.json();

    if (!calendarId)
      return NextResponse.json(
        { message: "Calendar Id is required!" },
        { status: 500 }
      );

    let updateBody = {};
    if (teamId) updateBody = { ...updateBody, teamId };

    const newCalendar = await prisma.calendar.update({
      where: { id: calendarId },
      data: { ...updateBody },
      include: {
        team: {
          select: {
            teamUsers: {
              include: {
                user: { select: { id: true, name: true, email: true } },
              },
            },
          },
        },
      },
    });

    return NextResponse.json(newCalendar);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();

    if (!id)
      return NextResponse.json(
        { message: "Calendar Id is required!" },
        { status: 500 }
      );

    await prisma.holiday.deleteMany({ where: { calendarId: id } });

    await prisma.calendar.delete({ where: { id } });

    return NextResponse.json({});
  } catch (error) {
    console.error(error);
    return NextResponse.json({ status: 500 });
  }
}
