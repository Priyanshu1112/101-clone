import slackClient from "@/service/slack";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { selectedMembers } = await request.json();

    console.log({ selectedMembers });

    await Promise.all(
      selectedMembers.map(async (userId: string) => {
        try {
          await slackClient.chat.postMessage({
            channel: userId,
            text: "Invite from 101! <https://app.use101.com|Visit App>",
          });
        } catch (error: unknown) {
          console.error(`Failed to message user ${userId}`, error);
        }
      })
    );

    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ status: 500 });
  }
}
