/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@services/prisma";
import { LeaveStatus, LeaveTime, NotificationType, Role } from "@prisma/client";
import slackClient, { slackUserClient } from "@/service/slack";
import { formatToSlackEmoji } from "@/app/api/_utils/getSlackEmojiText";
import { notifyLeadLeave } from "@/app/api/_utils/slackNotify";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { getSlackTimestamp } from "../../slack/status/route";
import { Summary } from "@/app/(dashboard)/settings/integrations/_components/SlackSettings";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

// Enhanced error logging utility
const logError = (message: string, context?: any) => {
  console.error(
    JSON.stringify(
      {
        message,
        timestamp: new Date().toISOString(),
        context,
      },
      null,
      2
    )
  );
};

// Leave Processing Service
class LeaveProcessingService {
  // Transform leave time types
  static transformLeaveTime(type: string): LeaveTime {
    const typeMap = {
      "Full Day": LeaveTime.FULL_DAY,
      "Full day": LeaveTime.FULL_DAY,
      "1st half": LeaveTime.FIRST_HALF,
      "2nd half": LeaveTime.SECOND_HALF,
      "First half": LeaveTime.FIRST_HALF,
      "Second half": LeaveTime.SECOND_HALF,
    };
    return typeMap[type] || LeaveTime.FULL_DAY;
  }

  // Determine leave time description
  static getLeaveTimeDescription(leaveRecord: any): string {
    if (leaveRecord.end) return "Full day";
    switch (leaveRecord.startTime) {
      case LeaveTime.FIRST_HALF:
        return "First half";
      case LeaveTime.SECOND_HALF:
        return "Second half";
      default:
        return "Full day";
    }
  }

  // Calculate expiration timestamp
  static calculateExpirationTimestamp(leaveRecord: any): number {
    const currentDate = dayjs().tz("Asia/Kolkata");

    if (leaveRecord.end) {
      return getSlackTimestamp(leaveRecord.end, leaveRecord.endTime);
    }

    return leaveRecord.startTime === LeaveTime.FIRST_HALF
      ? currentDate.set("hour", 13).set("minute", 0).unix()
      : currentDate.set("hour", 0).set("minute", 0).add(1, "day").unix();
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    // Validate and extract request data
    const { formData, autoApprove } = await request.json();
    const { start, end, leaveDetailId, reason, member } = formData;
    const { userId } = await params;

    // Input validation
    if (!start || !leaveDetailId || !userId) {
      return NextResponse.json(
        { error: "User id, start date and leave type are required!" },
        { status: 500 }
      );
    }

    // Transform leave times
    const startTime = LeaveProcessingService.transformLeaveTime(start.type);
    const endTime = end?.date
      ? LeaveProcessingService.transformLeaveTime(end.type)
      : null;

    const leaveUserId = member || userId;

    // Parallel data fetching
    const [leaveRecord, leaveDetail, user] = await Promise.all([
      // Create leave record
      prisma.leaveRecord.create({
        data: {
          user: { connect: { id: leaveUserId } },
          status: autoApprove ? LeaveStatus.APPROVED : LeaveStatus.PENDING,
          ...(autoApprove && { approvedBy: { connect: { id: userId } } }),
          leaveDetail: { connect: { id: leaveDetailId } },
          start: `${start.date}`,
          startTime,
          end: end?.date ? `${end.date}` : null,
          endTime,
          reason,
        },
        include: { user: { select: { slackId: true } } },
      }),
      // Fetch leave detail
      prisma.leaveDetail.findUnique({
        where: { id: leaveDetailId },
        select: { name: true },
      }),
      // Fetch user details
      prisma.user.findUnique({
        where: { id: leaveUserId },
        select: {
          id: true,
          approver: { select: { slackId: true, id: true } },
          slackId: true,
          companyId: true,
          name: true,
          company: { select: { dailyLeaveSummary: true } },
        },
      }),
    ]);

    const dailyLeaveSummary = user?.company
      ?.dailyLeaveSummary as unknown as Summary;
    // Current date and time calculations
    const currentDate = dayjs().tz("Asia/Kolkata");
    const summaryTime = dailyLeaveSummary
      ? dayjs.tz(
          `${currentDate.format("YYYY-MM-DD")} ${dailyLeaveSummary.time}`,
          "YYYY-MM-DD h:mm A",
          "Asia/Kolkata"
        )
      : null;

    // Collect async operations
    const asyncOperations: any[] = [];

    // Daily leave summary notification
    if (
      leaveRecord.start == currentDate.format("YYYY-MM-DD") &&
      user?.company?.dailyLeaveSummary &&
      currentDate.isAfter(summaryTime)
    ) {
      const channel = dailyLeaveSummary.channel;
      if (channel && leaveDetail?.name) {
        const leaveTime =
          LeaveProcessingService.getLeaveTimeDescription(leaveRecord);
        const [emoji, ...rest] = formatToSlackEmoji(leaveDetail.name).split(
          " "
        );

        asyncOperations.push(
          slackClient.chat.postMessage({
            channel,
            text: `@here <@${leaveRecord.user?.slackId}> has applied for a ${
              rest.join(" ") + " " + emoji
            } for ${
              leaveTime === "Full day"
                ? "today"
                : ` the ${leaveTime} of the day`
            }!`,
            mrkdwn: true,
            link_names: true,
          })
        );
      }
    }

    // Slack status update
    if (
      currentDate.format("YYYY-MM-DD") === leaveRecord.start &&
      ((currentDate.hour() < 14 &&
        leaveRecord.startTime !== LeaveTime.SECOND_HALF) ||
        (currentDate.hour() >= 14 &&
          leaveRecord.startTime === LeaveTime.SECOND_HALF)) &&
      leaveRecord.user?.slackId &&
      leaveDetail
    ) {
      const [leaveEmoji, ...rest] = formatToSlackEmoji(leaveDetail.name).split(
        " "
      );
      const expirationTimestamp =
        LeaveProcessingService.calculateExpirationTimestamp(leaveRecord);

      asyncOperations.push(
        slackUserClient.users.profile.set({
          user: leaveRecord.user.slackId,
          profile: {
            status_text: rest.join(" ").replace(/\*/g, ""),
            status_emoji: leaveEmoji,
            status_expiration: expirationTimestamp,
          },
        })
      );
    }

    // Notification creation
    if (currentDate.format("YYYY-MM-DD") === leaveRecord.start) {
      asyncOperations.push(
        prisma.notification.create({
          data: {
            title: `Leave ${
              autoApprove ? "auto-approved for " : "request from "
            } ${user?.name}`,
            text: JSON.stringify({
              start: leaveRecord.start,
              end: leaveRecord.end,
              startTime: leaveRecord.startTime,
              endTime: leaveRecord.endTime,
              name: leaveDetail?.name,
              reason: leaveRecord.reason,
            }),
            leaveStatus: leaveRecord.status,
            leaveRecordId: leaveRecord.id,
            type: NotificationType.Leave,
            for: [user?.approver?.id ?? "", user?.id ?? ""],
          },
        })
      );
    }

    // Notify lead or admins if not auto-approved
    if (!autoApprove) {
      const notificationPromise = async () => {
        const notificationRecipients = user?.approver?.slackId
          ? [user.approver.slackId]
          : await prisma.user
              .findMany({
                where: {
                  companyId: user?.companyId,
                  role: Role.Administrator,
                },
                select: { slackId: true },
              })
              .then((admins) =>
                admins
                  .map((a) => a.slackId)
                  .filter((id): id is string => id !== null)
              );

        const ts = await notifyLeadLeave(
          notificationRecipients,
          user?.slackId ?? "",
          {
            leaveId: leaveRecord.id,
            startDate: `${start.date}`,
            startTime: startTime,
            endDate: end?.date ? `${end.date}` : "Invalid Date",
            endTime,
            reason,
            leaveType: formatToSlackEmoji(leaveDetail?.name ?? ""),
          }
        );

        // Update leave record with timestamp
        await prisma.leaveRecord.update({
          where: { id: leaveRecord.id },
          data: { timeStamp: ts },
        });
      };

      asyncOperations.push(notificationPromise());
    }

    // Execute all async operations in parallel
    await Promise.all(asyncOperations);

    return NextResponse.json(leaveRecord);
  } catch (error) {
    logError("Leave application failed", {
      error: error instanceof Error ? error.message : String(error),
    });

    return NextResponse.json({
      status: 500,
      error: "Failed to process leave application",
    });
  }
}

// //notify approver on slack
// await slackClient?.chat.postMessage({
//   channel: leadId.slackId, // Send message to the lead's DM
//   text: "Leave request received", // Fallback text
//   blocks: [
//     {
//       type: "section",
//       text: {
//         type: "mrkdwn",
//         text: `*Leave Request Received* 📝\nYou have a leave request from <@${slackId}>.`,
//       },
//     },
//     {
//       type: "section",
//       text: {
//         type: "mrkdwn",
//         text: `*Leave Details* 🌴\n
//         *Leave Type:* ${leaveType}\n
//         *Start Date:* ${startDateTime}\n
//         *Start Time:* ${start.type}\n
//         *End Date:* ${endDateTime}\n
//         *End Time:* ${end.type}\n
//         *Reason:* ${reason || "Not provided"}`,
//       },
//     },
//     {
//       type: "actions",
//       elements: [
//         {
//           type: "button",
//           text: {
//             type: "plain_text",
//             text: "Approve",
//           },
//           style: "primary",
//           action_id: "approve_leave",
//           value: leaveRecord.id.toString(),
//         },
//         {
//           type: "button",
//           text: {
//             type: "plain_text",
//             text: "Reject",
//           },
//           style: "danger",
//           action_id: "reject_leave",
//           value: leaveRecord.id.toString(),
//         },
//       ],
//     },
//   ],
// });

export async function GET(request: NextRequest, { params }) {
  try {
    const { userId } = await params;

    if (!userId)
      return NextResponse.json(
        { error: "User id are required!" },
        { status: 500 }
      );

    const leaveRecords = await prisma.leaveRecord.findMany({
      where: { userId },
      select: {
        id: true,
        start: true,
        startTime: true,
        status: true,
        end: true,
        endTime: true,
        approvedBy: { select: { id: true, name: true } },
        leaveDetail: { select: { id: true, name: true } },
        reason: true,
      },
    });

    return NextResponse.json(leaveRecords);
  } catch (error) {
    console.error(error);
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { leaveId } = await request.json();

    if (!leaveId)
      return NextResponse.json(
        {
          message: "Leave Id is required!",
        },
        { status: 500 }
      );

    await prisma.notification.updateMany({
      where: { leaveRecordId: leaveId },
      data: { leaveRecordId: null },
    });

    const leaveRecord = await prisma.leaveRecord.delete({
      where: { id: leaveId },
      include: {
        user: {
          select: { id: true, name: true, approver: { select: { id: true } } },
        },
        leaveDetail: { select: { name: true } },
      },
    });

    // If there are notifications linked to this leave record, update them to remove the reference

    await prisma.notification.create({
      data: {
        title: `Leave deleted for ${leaveRecord.user?.name}`,
        text: JSON.stringify({
          start: leaveRecord.start,
          end: leaveRecord.end,
          startTime: leaveRecord.startTime,
          endTime: leaveRecord.endTime,
          name: leaveRecord.leaveDetail?.name,
          reason: leaveRecord.reason,
        }),
        type: NotificationType.Leave,
        for: [leaveRecord.user?.approver?.id ?? "", leaveRecord.user?.id ?? ""],
      },
    });

    return NextResponse.json({});
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Unexpected error occured",
      },
      { status: 500 }
    );
  }
}
