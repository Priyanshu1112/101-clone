/* eslint-disable @typescript-eslint/no-explicit-any */
import { formatToSlackEmoji } from "@/app/api/_utils/getSlackEmojiText";
import { notifyLeadLeave } from "@/app/api/_utils/slackNotify";
import slackClient, { slackUserClient } from "@/service/slack";
import {
  LeaveStatus,
  LeaveTime,
  LeaveType,
  NotificationType,
  Role,
} from "@prisma/client";
import { prisma } from "@services/prisma";
import { SlackInteractiveUser } from "@types";
import dayjs from "dayjs";
import { Summary } from "@/app/(dashboard)/settings/integrations/_components/SlackSettings";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { LeaveProcessingService } from "@/app/api/_utils/LeaveProcessing";
import { buildLeaveMessageBlocks } from "../leaveSummary";
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

export const ApplyLeave = async (
  view: any,
  user: SlackInteractiveUser,
  leaveType: LeaveType,
  startDate: Date,
  startTime: LeaveTime,
  endDate: Date | null,
  endTime: LeaveTime,
  reason: string | null
) => {
  try {
    // Parallel data fetching
    const [userDb, leaveDetail] = await Promise.all([
      prisma.user.findUnique({
        where: { slackId: user.id },
        select: {
          id: true,
          role: true,
          slackId: true,
          approver: { select: { id: true, slackId: true } },
          companyId: true,
          teamUsers: {
            where: { role: Role.Lead },
            select: { user: { select: { id: true, slackId: true } } },
          },
          company: {
            select: {
              dailyLeaveSummary: true,
              users: {
                where: {
                  OR: [{ role: Role.Administrator }, { role: Role.Owner }],
                  slackId: { not: user.id },
                },
                select: { id: true, slackId: true, role: true },
              },
            },
          },
        },
      }),
      prisma.leaveDetail.findUnique({
        where: { id: leaveType.toLowerCase() },
        select: { id: true, name: true, needsApproval: true },
      }),
    ]);

    if (!userDb) {
      logError("User not found", { userId: user.id });
      return;
    }

    const ownerAndAdmins = userDb.company?.users.filter((user) => user.slackId);
    const company = userDb.company;

    const autoApprove = userDb.role === "Owner";
    const formattedLeaveName = formatToSlackEmoji(leaveDetail?.name ?? "");

    // Format dates and times
    // const formattedStartDate = LeaveProcessingService.formatDate(startDate);
    const formattedStartDate = dayjs(startDate).format("DD/MM/YYYY");
    const formattedEndDate = dayjs(endDate).format("DD/MM/YYYY");
    const formattedStartTime = startTime;
    const formattedEndTime = endTime;

    // Create leave record
    const leaveRecord = await prisma.leaveRecord.create({
      data: {
        user: { connect: { id: userDb.id } },
        leaveDetail: { connect: { id: leaveDetail?.id } },
        start: dayjs(startDate).format("YYYY-MM-DD"),
        startTime: formattedStartTime ?? LeaveTime.FULL_DAY,
        end: endDate ? dayjs(endDate).format("YYYY-MM-DD") : null,
        endTime: formattedEndTime || null,
        reason,
        status: autoApprove ? LeaveStatus.APPROVED : LeaveStatus.PENDING,
        ...(autoApprove && { approvedBy: { connect: { id: userDb.id } } }),
      },
      include: {
        // user: {
        //   select: {
        //     slackId: true,
        //     company: { select: { dailyLeaveSummary: true } },
        //   },
        // },
        leaveDetail: { select: { name: true } },
      },
    });

    // Parallel async operations
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const asyncOperations: any[] = [];

    // Daily leave summary notification
    const dailyLeaveSummary = company?.dailyLeaveSummary as unknown as Summary;
    const currentDate = dayjs().tz("Asia/Kolkata");
    const summaryTime = dailyLeaveSummary
      ? dayjs.tz(
          `${currentDate.format("YYYY-MM-DD")} ${dailyLeaveSummary.time}`,
          "YYYY-MM-DD h:mm A",
          "Asia/Kolkata"
        )
      : null;

    if (
      leaveRecord.start == currentDate.format("YYYY-MM-DD") &&
      dailyLeaveSummary &&
      currentDate.isAfter(summaryTime)
    ) {
      const channel = dailyLeaveSummary.channel;
      if (channel && leaveRecord.leaveDetail.name) {
        const leaveTime =
          LeaveProcessingService.getLeaveTimeDescription(leaveRecord);
        const [emoji, ...rest] = formatToSlackEmoji(
          leaveRecord.leaveDetail.name
        ).split(" ");

        asyncOperations.push(
          slackClient.chat.postMessage({
            channel,
            text: `@here <@${userDb.slackId}> has applied for a ${
              rest.join(" ") + " " + emoji
            } for ${
              leaveTime == "Full day" ? "today" : `the ${leaveTime} of the day`
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
          leaveRecord.startTime !== LeaveTime.FIRST_HALF)) &&
      userDb.slackId &&
      leaveRecord.leaveDetail
    ) {
      const [leaveEmoji, ...rest] = formatToSlackEmoji(
        leaveRecord.leaveDetail.name
      ).split(" ");
      const expirationTimestamp =
        LeaveProcessingService.calculateExpirationTimestamp(leaveRecord);

      asyncOperations.push(
        slackUserClient.users.profile.set({
          user: userDb.slackId,
          profile: {
            status_text: rest.join(" ").replace(/\*/g, ""),
            status_emoji: leaveEmoji,
            status_expiration: expirationTimestamp,
          },
        })
      );
    }

    // Notification creation
    asyncOperations.push(
      prisma.notification.create({
        data: {
          title: `Leave request from ${user?.name}`,
          text: JSON.stringify({
            start: leaveRecord.start,
            end: leaveRecord.end,
            startTime: leaveRecord.startTime,
            endTime: leaveRecord.endTime,
            name: formattedLeaveName,
            reason: leaveRecord.reason,
          }),
          leaveStatus: LeaveStatus.PENDING,
          leaveRecordId: leaveRecord.id,
          type: NotificationType.Leave,
          for: [
            userDb.approver?.id ?? "",
            userDb.id ?? "",
            ownerAndAdmins
              ?.filter((u) => u.id !== userDb?.approver?.id)
              .map((u) => u.id)
              .join(",") ?? "",
          ],
        },
      })
    );

    const leaveBlock = buildLeaveMessageBlocks({
      autoApprove,
      startDate,
      endDate,
      startTime,
      endTime,
      leaveName: formattedLeaveName,
      reason,
    });

    asyncOperations.push(
      ...[
        slackClient.chat.postEphemeral({
          channel: view.external_id.split("_")[0],
          user: user.id,
          text: autoApprove
            ? "Leave submitted and auto approved."
            : "Leave Request Sent.",
          blocks: leaveBlock,
        }),
        slackClient.views.update({
          view_id: view.id,
          view: {
            callback_id: "apply_leave",
            type: "modal",
            title: {
              type: "plain_text",
              text: "Leave Applied", // Short title under 24 chars
            },
            blocks: [...leaveBlock],
          },
        }),
      ]
    );

    // Notify lead or admins if not auto-approved
    if (!autoApprove) {
      const notificationPromise = async () => {
        const notificationRecipients = [
          ...(ownerAndAdmins
            ?.filter((u) => u.id != userDb.approver?.slackId)
            .map((user) => user.slackId) ?? []),
        ].filter((slackId): slackId is string => slackId !== null);

        if (
          userDb.approver?.slackId &&
          !notificationRecipients.includes(userDb.approver.slackId)
        )
          notificationRecipients.push(userDb.approver.slackId);

        const ts = await notifyLeadLeave(
          notificationRecipients,
          userDb.slackId ?? "",
          {
            leaveId: leaveRecord.id,
            startDate: formattedStartDate,
            startTime: formattedStartTime,
            endDate: formattedEndDate,
            endTime: formattedEndTime,
            reason,
            leaveType: formattedLeaveName,
          }
        );

        // Update leave record with timestamp
        asyncOperations.push(
          prisma.leaveRecord.update({
            where: { id: leaveRecord.id },
            data: { timeStamp: ts },
          })
        );
      };

      asyncOperations.push(notificationPromise());
    }

    // Execute all async operations in parallel
    await Promise.all(asyncOperations);
  } catch (error) {
    logError("Leave application failed", {
      error: error instanceof Error ? error.message : String(error),
      user: user.id,
      leaveType,
    });

    // Notify user of failure
    await slackClient.views.update({
      view_id: view.id,
      view: {
        callback_id: "apply_leave",
        type: "modal",
        title: {
          type: "plain_text",
          text: "Leave Error...", // Short title under 24 chars
        },
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "Sorry, there was an error processing your leave request. Please try again.",
            },
          },
        ],
      },
    });
  }
};

export default ApplyLeave;
