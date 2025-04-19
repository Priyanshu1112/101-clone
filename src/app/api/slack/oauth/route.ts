import { prisma } from "@/service/prisma";
import slackClient from "@/service/slack";
import { WebClient } from "@slack/web-api";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const client = new WebClient();
  const code = request.nextUrl.searchParams.get("code");

  if (typeof code !== "string") {
    return NextResponse.json({ message: "Code is required" }, { status: 400 });
  }

  try {
    const result = await client.oauth.v2.access({
      client_id: process.env.SLACK_CLIENT_ID as string,
      client_secret: process.env.SLACK_CLIENT_SECRET as string,
      code,
    });

    const { team, authed_user } = result;

    if (!team || !authed_user) {
      return NextResponse.json(
        { message: "Invalid response from Slack." },
        { status: 400 }
      );
    }

    if (authed_user.id && authed_user.access_token) {
      let user = await prisma.user.findUnique({
        where: { slackId: authed_user.id },
        select: { companyId: true },
      });

      if (!user) {
        const { user: slackUser } = await slackClient.users.info({
          user: authed_user.id,
          token: authed_user.access_token,
        });

        const dbUser = await prisma.user.findUnique({
          where: { email: slackUser?.profile?.email },
        });

        if (!dbUser)
          return NextResponse.json(
            { message: "Use a pre-registered account!" },
            { status: 500 }
          );

        user = await prisma.user.update({
          where: { id: dbUser.id },
          data: { slackId: authed_user.id },
        });
      }

      if (user && user.companyId)
        await prisma.company.update({
          where: { id: user.companyId },
          data: { slackTeamId: team.id, slackTeamName: team.name },
        });

      const baseUrl = `https://${request.nextUrl.host}`;
      return NextResponse.redirect(baseUrl, {
        status: 302,
      });
    } else {
      return NextResponse.json(
        { message: "User ID or Access token is undefined" },
        { status: 400 }
      );
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log(error, error.data);
    if (error.data && error.data.error === "invalid_code") {
      return NextResponse.json(
        { message: "Invalid or expired authorization code." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Internal Error occurred" },
      { status: 500 }
    );
  }
}
