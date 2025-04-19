import dayjs from "dayjs";

// Convert Slack's time value to a descriptive label
export const TIME_LABELS = {
  FULL_DAY: "Full day",
  FIRST_HALF: "First Half",
  SECOND_HALF: "Second Half",
};

export function buildLeaveMessageBlocks({
  autoApprove,
  startDate,
  endDate,
  startTime,
  endTime,
  leaveName,
  reason,
}) {
  // Format start date/time
  const startDateFormatted = dayjs(startDate).format("DD MMM YYYY"); // e.g. "26 Aug 2024"
  const startDayOfWeek = dayjs(startDate).format("dddd"); // e.g. "Monday"
  const startTimeLabel = TIME_LABELS[startTime] || "N/A"; // e.g. "Start of Day"

  // Format end date/time if provided
  let endDateFormatted = "N/A";
  let endDayOfWeek = "";
  let endTimeLabel = "";

  if (endDate) {
    endDateFormatted = dayjs(endDate).format("DD MMM YYYY"); // e.g. "27 Aug 2024"
    endDayOfWeek = ` (${dayjs(endDate).format("dddd")})`; // e.g. " (Tuesday)"
    endTimeLabel = TIME_LABELS[endTime] ? ` - ${TIME_LABELS[endTime]}` : "";
  }
  const [leaveEmoji, ...rest] = leaveName.split(" ");
  const formattedLeaveName = rest.join(" ") + " " + leaveEmoji;
  // Build the final Slack blocks
  const blocks = [
    // Optional heading (e.g., “Leave Approved”)
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*${
          autoApprove ? "Leave Approved" : "Leave Request Sent"
        }* 🌴`,
      },
    },
    {
      type: "section",
      fields: [
        {
          type: "mrkdwn",
          text: `${
            endDate
              ? `*Start:*\n${startDateFormatted} - ${startTimeLabel} (${startDayOfWeek})`
              : `*Date:*\n${startDateFormatted} - (${startDayOfWeek})`
          }`,
        },
        {
          type: "mrkdwn",
          text: `${
            endDate
              ? `*End:*\n${endDateFormatted}${endTimeLabel}${endDayOfWeek}`
              : `*Duration:*\n${startTimeLabel}`
          }`,
        },
      ],
    },
    {
      type: "section",
      fields: [
        {
          type: "mrkdwn",
          text: `*Type:*\n ${formattedLeaveName}`,
        },
        {
          type: "mrkdwn",
          text: `*Reason:*\n${reason || "Not provided"}`,
        },
      ],
    },
  ];

  return blocks;
}
