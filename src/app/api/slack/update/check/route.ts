import { NextResponse } from "next/server";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { prisma } from "@/service/prisma";
import slackClient from "@/service/slack";
import { get12hr } from "@/utils/helpers/get12hour";
import { getValidResponse } from "@/app/api/_utils/getValidResponse";
import { NotificationType } from "@prisma/client";

dayjs.extend(utc);
dayjs.extend(timezone);

export async function GET() {
  try {
    // Fetch all scheduled responses with their associated update times
    const responses = await prisma.updateResponse.findMany({
      where: {
        status: "Scheduled",
      },
      include: {
        user: { select: { slackId: true, id: true } },
        update: { include: { team: true } },
      },
    });

    // Filter responses where update time + 30 minutes is past current time
    const responsesToUpdate = getValidResponse(responses, 30);

    const responsesToNotify = getValidResponse(responses, 15);

    const slackUpdates = getValidResponse(responses, 0, true);

    slackUpdates.forEach(async (response) => {
      const update = response.update;
      const user = response.user;
      const time = get12hr(update.time);

      const { ts } = await slackClient.chat.postMessage({
        channel: user.slackId,
        text: "Update",
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*Update for ${update.team.name}, ${time} (1/${update.questions.length})*\n\n${update.questions[0]}`,
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
                action_id: "update_response|" + response.id + "|" + "1",
                style: "primary",
              },
            ],
          },
        ],
      });

      await prisma.updateResponse.update({
        where: { id: response.id },
        data: { timeStamp: ts },
      });
    });

    await Promise.all(
      responsesToNotify.map((res) =>
        prisma.notification.create({
          data: {
            title: "Hurry! Fill the CheckIn",
            text: `CheckIn for ${res.update.team.name}, ${get12hr(
              res.update.time
            )} is live!`,
            type: NotificationType.UpdateReminder,
            updateResponseId: res.id,
            for: [res.user.id],
          },
        })
      )
    );

    // Update the status to "Incomplete" for filtered responses
    const updatedCount = await prisma.updateResponse.updateMany({
      where: {
        id: {
          in: responsesToUpdate.map((response) => response.id),
        },
      },
      data: {
        status: "Incomplete",
      },
    });

    return NextResponse.json({
      success: true,
      updated: updatedCount.count,
      message: `Updated ${updatedCount.count} responses to Incomplete`,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Unexpected error occurred!",
      },
      { status: 500 }
    );
  }
}
