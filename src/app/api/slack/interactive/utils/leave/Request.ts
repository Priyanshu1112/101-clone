import { getLeaveDetaillWithBalance } from "@/app/api/_utils/getLeaveDetailWithBalance";
import { formatToSlackEmoji } from "@/app/api/_utils/getSlackEmojiText";
import { prisma } from "@/service/prisma";
import slackClient from "@/service/slack";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { LeaveType } from "@prisma/client";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const RequestLeave = async (
  channelId: string,
  userId: string,
  trigger_id
) => {
  const user = await prisma.user.findUnique({
    where: { slackId: userId },
    select: { gender: true, id: true, companyId: true },
  });

  if (!user) {
    throw new Error("User is required!");
  }

  const ldwb = await getLeaveDetaillWithBalance({
    userId: user?.id,
    companyId: user?.companyId ?? "",
  });

  const currendYear = dayjs().tz("Asia/Kolkata").year();

  if (!ldwb || ldwb.length === 0) {
    await slackClient.chat.postEphemeral({
      channel: channelId,
      user: userId,
      text: "No leave added by your company!",
    });
    return; // stop execution here
  }

  // });
  await slackClient?.views.open({
    trigger_id, // Make sure to pass the trigger_id

    view: {
      type: "modal",
      callback_id: "apply_leave",
      external_id: `${channelId}_${userId}_${Date.now()}`,
      title: {
        type: "plain_text",
        text: "Apply for Leave",
      },
      submit: {
        type: "plain_text",
        text: "Submit",
      },
      close: {
        type: "plain_text",
        text: "Cancel",
      },
      blocks: [
        {
          type: "input",
          block_id: "leave_type",
          element: {
            type: "static_select",
            action_id: "leave_type_selection",
            placeholder: {
              type: "plain_text",
              text: "Select leave type",
            },
            options: ldwb.map((detail) => {
              const name = formatToSlackEmoji(detail.name).replace(/\*/g, "");

              const unlimited =
                detail.unlimited || detail.type == LeaveType.Non_Deductible;

              const activeDetail = unlimited
                ? null
                : detail.detail.find((d) => d.year == currendYear.toString());

              const option =
                name +
                (unlimited
                  ? ""
                  : " (" + (activeDetail?.balance ?? detail.allowance) + ")");

              return {
                text: {
                  type: "plain_text",
                  text: option, // Fallback name
                },
                value:
                  detail.id +
                  "--balance--" +
                  (activeDetail?.balance ?? detail.allowance) +
                  "--name--" +
                  name,
              };
            }),
          },
          label: {
            type: "plain_text",
            text: "Leave Type",
          },
        },
        {
          type: "section",
          block_id: "start_group",

          text: {
            type: "mrkdwn",
            text: "*Start Date*",
          },
          accessory: {
            type: "datepicker",
            action_id: "start_date_selection",

            placeholder: {
              type: "plain_text",
              text: "Select a start date",
            },
          },
        },
        {
          type: "section",
          block_id: "start_time",
          text: {
            type: "mrkdwn",
            text: "*Start Time*",
          },
          accessory: {
            type: "static_select",
            action_id: "start_time_selection",
            placeholder: {
              type: "plain_text",
              text: "Select start time",
            },
            options: [
              {
                text: {
                  type: "plain_text",
                  text: "Full day",
                },
                value: "FULL_DAY",
              },
              {
                text: {
                  type: "plain_text",
                  text: "First half",
                },
                value: "FIRST_HALF",
              },
              {
                text: {
                  type: "plain_text",
                  text: "Second half",
                },
                value: "SECOND_HALF",
              },
            ],
          },
        },
        {
          type: "section",
          block_id: "end_group",
          text: {
            type: "mrkdwn",
            text: "*End Date (Optional)*",
          },
          accessory: {
            type: "datepicker",
            action_id: "end_date_selection",
            placeholder: {
              type: "plain_text",
              text: "Select an end date",
            },
          },
        },
        {
          type: "section",
          block_id: "end_time",

          text: {
            type: "mrkdwn",
            text: "*End Time (Optional)*",
          },
          accessory: {
            type: "static_select",
            action_id: "end_time_selection",
            placeholder: {
              type: "plain_text",
              text: "Select end time",
            },
            options: [
              {
                text: {
                  type: "plain_text",
                  text: "Full day",
                },
                value: "FULL_DAY",
              },
              {
                text: {
                  type: "plain_text",
                  text: "First half",
                },
                value: "FIRST_HALF",
              },
              {
                text: {
                  type: "plain_text",
                  text: "Second half",
                },
                value: "SECOND_HALF",
              },
            ],
          },
        },
        {
          type: "input",
          block_id: "reason",
          optional: true, // Make this field optional
          element: {
            type: "plain_text_input",
            action_id: "reason_input",
            placeholder: {
              type: "plain_text",
              text: "Write something...",
            },
          },
          label: {
            type: "plain_text",
            text: "Reason",
          },
        },
      ],
    },
  });
};
