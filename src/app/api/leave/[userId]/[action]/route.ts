import { prisma } from "@/service/prisma";
import { LeaveStatus, NotificationType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string; action: string }> }
) {
  try {
    const { userId, action } = await params;
    const { leaveId } = await request.json();

    if (!userId || !action || !leaveId)
      return NextResponse.json(
        {
          message: "UserId, leave id and action all are required!",
        },
        { status: 500 }
      );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let leaveRecord: any;

    if (action == "reject") {
      leaveRecord = await prisma.leaveRecord.update({
        where: { id: leaveId },
        data: { status: "REJECTED", approvedById: userId },
        select: {
          id: true,
          user: { select: { slackId: true, name: true, id: true } },
          leaveDetail: { select: { name: true } },
          start: true,
          end: true,
          startTime: true,
          endTime: true,
          reason: true,
        },
      });
    } else if (action == "approve") {
      leaveRecord = await prisma.leaveRecord.update({
        where: { id: leaveId },
        data: { status: "APPROVED", approvedById: userId },
        select: {
          id: true,
          user: { select: { slackId: true, name: true, id: true } },
          leaveDetail: { select: { name: true } },
          start: true,
          end: true,
          startTime: true,
          endTime: true,
          reason: true,
        },
      });
    }

    await prisma.notification.create({
      data: {
        title: `Leave ${action == "reject" ? "rejected" : "approved"} for ${
          leaveRecord.user?.name
        }`,
        text: JSON.stringify({
          start: leaveRecord.start,
          end: leaveRecord.end,
          startTime: leaveRecord.startTime,
          endTime: leaveRecord.endTime,
          name: leaveRecord.leaveDetail?.name,
          reason: leaveRecord.reason,
        }),
        leaveRecordId: leaveRecord.id,
        leaveStatus:
          action == "reject" ? LeaveStatus.REJECTED : LeaveStatus.APPROVED,
        type: NotificationType.Leave,
        for: [userId ?? "", leaveRecord.user?.id ?? ""],
      },
    });

    return NextResponse.json({});
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
