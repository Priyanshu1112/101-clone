import { formatToSlackEmoji } from "@/app/api/_utils/getSlackEmojiText";
import { prisma } from "@/service/prisma";
import slackClient from "@/service/slack";
import { LeaveStatus, NotificationType } from "@prisma/client";

export const RejectLeave = async (
  leaveRecordId: string,
  messageTs: string,
  channelId: string,
  slackUser: string,
  message
) => {
  try {
    // Find the approver's user ID based on their Slack ID
    const approver = await prisma.user.findUnique({
      where: { slackId: slackUser },
      select: { id: true },
    });

    // Update the leave record to mark it as REJECTED
    const leaveRecord = await prisma.leaveRecord.update({
      where: { id: leaveRecordId },
      data: {
        status: LeaveStatus.REJECTED,
        approvedById: approver?.id ?? "",
      },
      select: {
        id: true,
        user: { select: { slackId: true, name: true, id: true } },
        leaveDetail: { select: { name: true } },
        start: true,
        end: true,
        startTime: true,
        endTime: true,
        reason: true,
        approvedBy: { select: { slackId: true } },
      },
    });

    await prisma.notification.create({
      data: {
        title: `Leave rejected for ${leaveRecord.user?.name}`,
        text: JSON.stringify({
          start: leaveRecord.start,
          end: leaveRecord.end,
          startTime: leaveRecord.startTime,
          endTime: leaveRecord.endTime,
          name: leaveRecord.leaveDetail?.name,
          reason: leaveRecord.reason,
        }),
        leaveStatus: LeaveStatus.REJECTED,
        leaveRecordId: leaveRecord.id,
        type: NotificationType.Leave,
        for: [approver?.id ?? "", leaveRecord.user?.id ?? ""],
      },
    });

    await Promise.all([
      // Update the original Slack message in the approval channel
      slackClient.chat.update({
        channel: channelId,
        ts: messageTs,
        text: "Leave rejected.",
        blocks: [
          ...message.blocks.filter((b) => {
            return b.type != "actions";
          }),
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "Request Rejected ❌",
            },
          },
        ],
      }),

      // Send a direct message to the requester about rejection
      slackClient.chat.postMessage({
        channel: leaveRecord.user?.slackId ?? "",
        text: "Your leave request has been rejected.",
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `${formatToSlackEmoji(leaveRecord.leaveDetail.name).replace(
                /\*/g,
                ""
              )} Rejected ❌`,
            },
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `Your leave has been rejected by <@${leaveRecord.approvedBy?.slackId}>`,
            },
          },
          {
            type: "context",
            elements: [
              {
                type: "mrkdwn",
                text: `If you have any questions, please contact your approver directly.`,
              },
            ],
          },
        ],
      }),
    ]);
  } catch (error) {
    console.error("RejectLeave: Error occurred:", error);
  }
};
