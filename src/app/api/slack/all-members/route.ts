import slackClient from "@/service/slack";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/_authOptions";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    const res = await slackClient.users.list({});

    const members = res.members
      ?.filter((member) => {
        return (
          !member.is_bot &&
          member.profile?.email &&
          !member.deleted &&
          session?.user.email != member.profile.email
        );
      })
      .map((member) => {
        return {
          id: member.id,
          name: member.profile?.display_name || member.real_name,
          email: member.profile?.email || null,
          image: member.profile?.image_48,
        };
      });

    return NextResponse.json(members);
  } catch (e) {
    console.error("Error fetching Slack members:", e);

    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
