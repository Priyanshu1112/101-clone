import { prisma } from "@/service/prisma";
import { slackUserClient } from "@/service/slack";
import dayjs from "dayjs";
import { NextResponse } from "next/server";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { LeaveStatus, LeaveTime } from "@prisma/client";
import { formatToSlackEmoji } from "@/app/api/_utils/getSlackEmojiText";
import { LeaveProcessingService } from "../../_utils/LeaveProcessing";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

// Fixed timestamp function that returns Unix timestamp
export const getSlackTimestamp = (date, time) => {
  const day = dayjs(date, "YYYY-MM-DD").tz("Asia/Kolkata");
  const fH = time === LeaveTime.FIRST_HALF;

  return (fH ? day : day.add(1, "day"))
    .set("hour", fH ? 13 : 0)
    .set("minute", 0)
    .unix(); // Make sure to return Unix timestamp
};

export async function GET() {
  try {
    const currentDay = dayjs().tz("Asia/Kolkata").format("YYYY-MM-DD");
    const time = dayjs().tz("Asia/Kolkata").hour();

    const records = await prisma.leaveRecord.findMany({
      where: {
        start: currentDay,
        startTime:
          time < 14 ? { not: LeaveTime.SECOND_HALF } : LeaveTime.SECOND_HALF,
        status: { not: LeaveStatus.REJECTED },
      },
      select: {
        start: true,
        startTime: true,
        end: true,
        endTime: true,
        user: { select: { slackId: true } },
        leaveDetail: { select: { name: true } },
      },
    });

    const results = await Promise.all(
      records.map(async (rec) => {
        if (rec.user?.slackId && rec.leaveDetail?.name) {
          const [leaveEmoji, ...rest] = formatToSlackEmoji(
            rec.leaveDetail.name
          ).split(" ");

          // Calculate expiration timestamp
          const expirationTimestamp =
            LeaveProcessingService.calculateExpirationTimestamp(rec);

          return slackUserClient.users.profile.set({
            user: rec.user.slackId,
            profile: {
              status_text: rest.join(" ").replace(/\*/g, ""),
              status_emoji: leaveEmoji,
              status_expiration: expirationTimestamp,
            },
          });
        }
        return null;
      })
    );

    return NextResponse.json({ records, results });
  } catch (error) {
    console.error("Error in leave status update:", error);
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
