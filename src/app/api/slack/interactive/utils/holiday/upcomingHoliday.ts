import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { prisma } from "@/service/prisma";
import slackClient from "@/service/slack";

dayjs.extend(utc);
dayjs.extend(timezone);

export async function UpcomingHoliday(channelId: string, userId: string) {
  const currentDate = dayjs().tz("Asia/Kolkata").format("YYYY-MM-DD");

  // Step 1: Fetch the closest future holiday directly from DB
  const upcomingHolidays = await prisma.holiday.findMany({
    where: {
      calendar: {
        team: {
          teamUsers: {
            some: { user: { slackId: userId } },
          },
        },
      },
      start: { gte: currentDate },
    },
    orderBy: { start: "asc" },
    take: 3,
    select: { date: true, occasion: true, start: true },
  });

  if (upcomingHolidays.length === 0) {
    await slackClient.chat.postEphemeral({
      channel: channelId,
      user: userId,
      text: "No upcoming holidays found. 🎉",
    });
    return;
  }

  // Create holiday list message
  const holidayList = upcomingHolidays
    .map(
      (h) => `*${h.occasion}* - ${dayjs(h.start, "YYYY-MM-DD").format("MMM D")}`
    )
    .join("\n>");

  // Send Slack message
  await slackClient.chat.postEphemeral({
    channel: channelId,
    user: userId,
    text: `🎉 Upcoming holidays: \n> ${holidayList}`,
  });
}
