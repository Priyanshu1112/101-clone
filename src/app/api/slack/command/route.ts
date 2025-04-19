import { NextRequest, NextResponse } from "next/server";
// import { WebClient } from "@slack/web-api";
import { prisma } from "@/service/prisma";
import slackClient from "@/service/slack";

// const slackClient = new WebClient(process.env.SLACK_BOT_TOKEN);

async function parseRequestBody(request: NextRequest) {
  const body = await request.text();
  const params = new URLSearchParams(body);
  return Object.fromEntries(params.entries());
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const payload = await parseRequestBody(request);

    const userId = payload.user_id;
    const channelId = payload.channel_id;

    const user = await prisma.user.findUnique({ where: { slackId: userId } });

    if (!user) {
      const { user: slackUser } = await slackClient.users.info({
        user: userId,
      });

      const domain = slackUser?.profile?.email?.split("@")[1];

      const company = await prisma.company.findUnique({ where: { domain } });

      await prisma.user.create({
        data: {
          slackId: userId,
          colorCode: Math.floor(Math.random() * 15),
          email: slackUser?.profile?.email ?? "",
          name: slackUser?.profile?.real_name ?? "",
          companyId: company?.id ?? "",
        },
      });
    }

    // Define blocks
    const blocks = [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          // text: `Hi <@${userId}>! Please use our <https://app.use101.com|101> to apply for leave.`,
          text: `Hi <@${userId}>! Choose an option:`,
        },
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "📝 Apply leave",
            },
            action_id: "leave_request",
          },
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "💼 Check leave balance",
            },
            action_id: "leave_balance",
          },
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "📅 View team calendar",
            },
            url: "https://app.use101.com/leaves", // ✅ Attach URL
            action_id: "leave_team",
            style: "primary",
          },
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "🎉 View upcoming holidays",
            },
            action_id: "view_holidays",
          },
        ],
      },
    ];

    await slackClient.chat.postEphemeral({
      channel: channelId,
      user: userId,
      // text: "Choose an option below:",
      blocks,
    });
    // }

    return NextResponse.json({ text: "Choose option!" });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error) {
    return NextResponse.json(
      {
        response_type: "ephemeral",
        text:
          error instanceof Error
            ? error.message
            : "Error processing the request.",
      },
      { status: 500 }
    );
  }
}
