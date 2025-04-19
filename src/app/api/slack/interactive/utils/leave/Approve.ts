// import slackClient from "@/service/slack";
// import { prisma } from "@services/prisma";

import { formatToSlackEmoji } from "@/app/api/_utils/getSlackEmojiText";
import { prisma } from "@/service/prisma";
import slackClient from "@/service/slack";
import { LeaveStatus, NotificationType } from "@prisma/client";

export const ApproveLeave = async (
  leaveRecordId: string,
  messageTs: string,
  channelId: string,
  slackUser: string,
  message
) => {
  try {
    // Find the leave record and its corresponding leave type
    const approver = await prisma.user.findUnique({
      where: { slackId: slackUser },
      select: { id: true },
    });

    const leaveRecord = await prisma.leaveRecord.update({
      where: { id: leaveRecordId },
      data: { status: LeaveStatus.APPROVED, approvedById: approver?.id ?? "" },
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
        title: `Leave approved for ${leaveRecord.user?.name}`,
        text: JSON.stringify({
          start: leaveRecord.start,
          end: leaveRecord.end,
          startTime: leaveRecord.startTime,
          endTime: leaveRecord.endTime,
          name: leaveRecord.leaveDetail?.name,
          reason: leaveRecord.reason,
        }),
        leaveStatus: LeaveStatus.APPROVED,
        leaveRecordId: leaveRecord.id,
        type: NotificationType.Leave,
        for: [approver?.id ?? "", leaveRecord.user?.id ?? ""],
      },
    });

    await Promise.all([
      // Update the Slack message in the original channel
      slackClient.chat.update({
        channel: channelId,
        ts: messageTs,
        text: "Leave approved! 🎉",
        blocks: [
          ...message.blocks.filter((b) => {
            return b.type != "actions";
          }),
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "Request Approved ✅",
            },
          },
        ],
      }),
      // Notify the user in their Slack DM
      slackClient.chat.postMessage({
        channel: leaveRecord.user?.slackId ?? "",
        text: "Leave request approved", // Fallback text
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `${formatToSlackEmoji(leaveRecord.leaveDetail.name).replace(
                /\*/g,
                ""
              )} Approved ✅`,
            },
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `Your leave has been approved by <@${leaveRecord.approvedBy?.slackId}>`,
            },
          },
        ],
      }),
    ]);
  } catch (error) {
    // Handle errors and log them for debugging
    console.error("ApproveLeave: Error occurred:", error);
    throw error; // Optionally rethrow the error for further handling
  }
};
