import { getValidResponse } from "@/app/api/_utils/getValidResponse";
import { prisma } from "@/service/prisma";
import slackClient from "@/service/slack";
import { get12hr } from "@/utils/helpers/get12hour";
import { UpdateResponseStatus } from "@prisma/client";

export const submitUpdate = async (
  responseId: string,
  question: string,
  answer: string,
  ts: string,
  channel: string
) => {
  // if (!answer) {
  //   await slackClient.chat.update({
  //     ts,
  //     channel,
  //     text: "No Text",
  //     blocks: [
  //       {
  //         type: "section",
  //         text: {
  //           type: "mrkdwn",
  //           text: "Response is required to",
  //         },
  //       },
  //     ],
  //   });
  // }

  // Single database query with optimized select
  const response = await prisma.updateResponse.findUnique({
    where: { id: responseId },
    select: {
      id: true,
      answer: true,
      user: { select: { slackId: true } },
      update: {
        select: {
          questions: true,
          time: true,
          team: {
            select: {
              name: true,
              teamUsers: {
                where: { role: "Lead" },
                select: { user: { select: { slackId: true } } },
              },
            },
          },
        },
      },
    },
  });

  if (!response) return;

  const isValid = getValidResponse([response], 30).length == 0;

  if (!isValid) {
    await slackClient.chat.update({
      channel: channel,
      ts: ts,
      text: `Missed Update: \n :slightly_frowning_face: Marked Incomplete 
      \n> Oops! Looks like you've missed posting the updates in time. \n> Post your next updates within time. :wink:`,
    });

    return;
  } else {
    await slackClient.chat.update({
      ts,
      channel,
      text: "Submitting response...",
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "Submitting response...",
          },
        },
      ],
    });
  }

  const questionNum = Number(question);
  const isComplete = response.update.questions.length === questionNum;
  const newAnswers = [...response.answer, answer];

  // Combine database operations
  const updateResponse = await prisma.updateResponse.update({
    where: { id: responseId },
    data: {
      answer: newAnswers,
      ...(isComplete && { status: UpdateResponseStatus.Complete }),
    },
  });

  // Prepare message blocks outside of API calls
  if (isComplete) {
    const formattedResponse = response.update.questions
      .map(
        (q, i) => `*${q}*\n${updateResponse.answer[i] || "No answer provided"}`
      )
      .join("\n\n");

    // Filter valid Slack IDs first to avoid unnecessary API calls
    const validSlackIds = response.update.team.teamUsers
      .map((data) => data.user.slackId)
      .filter(Boolean);

    const slackMessages = validSlackIds.map(
      (slackId) =>
        slackId &&
        slackClient.chat.postMessage({
          channel: slackId,
          text: `*Update Completed from <@${response.user.slackId}>*\n\n${formattedResponse}`,
        })
    );

    slackMessages.push(
      slackClient.chat.update({
        channel: channel,
        ts: ts,
        text: "Thanks for the update! Have a good day!",
      })
    );

    // Batch Slack messages in a single Promise.all
    await Promise.all(slackMessages);
  } else {
    // STEP 2: Prepare blocks for the new question
    const blocks = [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Update for ${response.update.team.name}, ${get12hr(
            response.update.time
          )} (${questionNum + 1}/${response.update.questions.length})*\n\n${
            response.update.questions[questionNum]
          }`,
        },
      },
      {
        type: "input",
        block_id: "user_response",
        label: {
          type: "plain_text",
          text: "Your Response",
        },
        element: {
          type: "plain_text_input",
          action_id: "response_input",
          placeholder: {
            type: "plain_text",
            text: "Write your response...",
          },
          // Removed initial_value as it doesn't work reliably in updates
        },
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "Submit",
            },
            action_id: `update_response|${response.id}|${questionNum + 1}`,
            style: "primary",
          },
        ],
      },
    ];

    // Then update with the new question blocks
    await slackClient.chat.update({
      ts,
      channel,
      text: "Update",
      blocks,
    });
  }
};
