import { prisma } from "@/service/prisma";
import dayjs from "dayjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { calendarId, date, occasion, start, end } = await request.json();

    if (!calendarId)
      return NextResponse.json(
        { message: "Holiday Id is required!" },
        { status: 500 }
      );

    console.log({ start, end });

    const holiday = await prisma.holiday.create({
      data: {
        date: dayjs(date).format("MMM D"),
        occasion,
        calendarId,
        start,
        end,
      },
    });

    return NextResponse.json(holiday);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { holidayId } = await request.json();

    if (!holidayId)
      return NextResponse.json(
        { message: "Holiday Id is required!" },
        { status: 500 }
      );

    await prisma.holiday.delete({ where: { id: holidayId } });

    return NextResponse.json({});
  } catch (error) {
    console.error(error);
    return NextResponse.json({ status: 500 });
  }
}
