/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { WeekDay } from "@prisma/client";
import { prisma } from "@/service/prisma";

dayjs.extend(utc);
dayjs.extend(timezone);

const todayStart = dayjs().startOf("day").toDate(); // Start of today
const todayEnd = dayjs().endOf("day").toDate(); // End of today

export async function GET() {
  try {
    const currentDate = dayjs().tz("Asia/Kolkata").format("YYYY-MM-DD");
    const currentDay = (dayjs()
      .tz("Asia/Kolkata")
      .format("dddd")
      .toUpperCase()
      .charAt(0) +
      dayjs()
        .tz("Asia/Kolkata")
        .format("dddd")
        .toLowerCase()
        .slice(1)) as WeekDay;

    // Optimize initial query by filtering at the database level
    const updates = await prisma.update.findMany({
      where: {
        team: {
          AND: {
            // Filter out teams with holidays
            calendar: {
              none: {
                holiday: {
                  some: {
                    date: currentDate,
                  },
                },
              },
            },
            // Filter out teams with week offs
            workDay: {
              none: {
                weekOff: {
                  has: currentDay,
                },
              },
            },
          },
        },
      },
      select: {
        id: true,
        members: {
          where: {
            // Filter out members on leave at database level
            leaveRecord: {
              none: {
                AND: {
                  start: { lte: currentDate },
                  end: { gte: currentDate },
                  status: "APPROVED",
                },
              },
            },
          },
          select: {
            id: true,
          },
        },
      },
    });

    if (!updates || updates.length === 0) {
      return NextResponse.json({
        success: false,
        message: "No updates found.",
      });
    }

    // Prepare batch operation data
    const updateOperations = updates.flatMap((update) =>
      update.members.map((member) => ({
        updateId: update.id,
        userId: member.id,
        status: "Scheduled" as const,
        answer: [],
        updatedAt: new Date(),
        createdAt: new Date(),
      }))
    );

    if (updateOperations.length === 0) {
      return NextResponse.json({
        success: true,
        processed: 0,
        message: "No updates required",
      });
    }

    // Check existing responses in batch
    const existingResponses = await prisma.updateResponse.findMany({
      where: {
        OR: updateOperations.map((op) => ({
          AND: {
            userId: op.userId,
            updateId: op.updateId,
            createdAt: {
              gte: todayStart,
              lte: todayEnd,
            },
          },
        })),
      },
      select: {
        userId: true,
        updateId: true,
      },
    });

    // Filter out existing responses
    const newOperations = updateOperations.filter(
      (op) =>
        !existingResponses.some(
          (existing) =>
            existing.userId === op.userId && existing.updateId === op.updateId
        )
    );

    if (newOperations.length === 0) {
      return NextResponse.json({
        success: true,
        processed: 0,
        message: "No new updates required",
      });
    }

    // Create all responses in a single batch operation
    const result = await prisma.updateResponse.createMany({
      data: newOperations,
      skipDuplicates: true,
    });

    return NextResponse.json({
      success: true,
      processed: result.count,
      message: `Successfully processed ${result.count} updates`,
    });
  } catch (error) {
    // console.log("API Error:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      },
      {
        status: 500,
      }
    );
  } finally {
    await prisma.$disconnect();
  }
}
