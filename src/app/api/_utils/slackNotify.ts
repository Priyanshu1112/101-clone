import slackClient from "@/service/slack";
import { TIME_LABELS } from "../slack/interactive/utils/leaveSummary";

export const notifyLeadLeave = async (
  slackId: string | string[],
  userId: string,
  { leaveId, leaveType, startDate, startTime, endDate, endTime, reason }
) => {
  try {
    let response: string[] = [];

    if (Array.isArray(slackId)) {
      response = await Promise.all(
        slackId.map(
          async (id) =>
            (await notify(id, userId, {
              leaveId,
              leaveType,
              startDate,
              startTime,
              endDate,
              endTime,
              reason,
            })) || ""
        ) // Ensure every item in the array is a string
      );
    } else {
      const ts = await notify(slackId, userId, {
        leaveId,
        leaveType,
        startDate,
        startTime,
        endDate,
        endTime,
        reason,
      });

      response = [ts || ""]; // Ensure response is always an array of strings
    }

    return response;
  } catch (error) {
    console.error("Error notifying lead:", error);
    return [];
  }
};

const notify = async (
  slackId: string,
  userId: string,
  { leaveId, leaveType, startDate, startTime, endDate, endTime, reason }
) => {
  const isEndValid = endDate !== "Invalid Date";

  return (
    await slackClient?.chat.postMessage({
      channel: slackId, // Send message to the lead's DM
      text: "Leave request received", // Fallback text
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*${leaveType.replace(
              /\*/g,
              ""
            )}* request from <@${userId}>.`,
          },
        },

        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*${isEndValid ? "Start " : ""}Date:* ${startDate}`,
          },
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*Duration:* ${TIME_LABELS[startTime] || "N/A"}`,
          },
        },
        ...(isEndValid
          ? [
              {
                type: "section" as const,
                text: {
                  type: "mrkdwn" as const,
                  text: `*End Date:* ${endDate}`,
                },
              },
              {
                type: "section" as const,
                text: {
                  type: "mrkdwn" as const,
                  text: `*End Time:* ${TIME_LABELS[endTime] || "N/A"}`,
                },
              },
            ]
          : []),
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*Reason:* ${reason || "Not provided"}`,
          },
        },
        {
          type: "actions",
          elements: [
            {
              type: "button",
              text: {
                type: "plain_text",
                text: "Approve",
              },
              style: "primary",
              action_id: "approve_leave",
              value: leaveId.toString(),
            },
            {
              type: "button",
              text: {
                type: "plain_text",
                text: "Reject",
              },
              style: "danger",
              action_id: "reject_leave",
              value: leaveId.toString(),
            },
          ],
        },
      ],
    })
  ).ts;
};
