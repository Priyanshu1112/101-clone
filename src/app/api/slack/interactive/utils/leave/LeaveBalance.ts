import { getLeaveDetaillWithBalance } from "@/app/api/_utils/getLeaveDetailWithBalance";
import { formatToSlackEmoji } from "@/app/api/_utils/getSlackEmojiText";
import { prisma } from "@/service/prisma";
import slackClient from "@/service/slack";

export async function LeaveBalance(channelId: string, slackUser: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { slackId: slackUser },
      select: { companyId: true, id: true },
    });

    if (!user || !user.id || !user.companyId) {
      await slackClient.chat.postMessage({
        channel: slackUser,
        text: "User with the SlackId not found!",
      });

      return;
    }

    const leaveDetailWithBalance = await getLeaveDetaillWithBalance({
      userId: user?.id,
      companyId: user?.companyId,
    });

    // const leaveDetails = await prisma.leaveDetail.findMany({
    //   where: { companyId: user?.companyId ?? "" },
    // });

    // const groupedLeaveRecords = leaveDetails.reduce((acc, record) => {
    //   if (!acc[record.id]) {
    //     let balance = record.allowance || 0;

    //     if (record.carryForward) {
    //       const yearsPassed = dayjs().diff(record.addedOn, "year");
    //       const monthsPassed = dayjs().diff(record.addedOn, "month") % 12;

    //       balance =
    //         record.allowanceType === AllowanceType.Monthly
    //           ? (monthsPassed || 1) * Number(record.allowance || 0)
    //           : (yearsPassed || 1) * Number(record.allowance || 0);
    //     }

    //     acc[record.id] = {
    //       leaveDetailId: record.id,
    //       leaveDetailName:
    //         (record?.name).split(" ").splice(1).join(" ") ?? "Unknown",
    //       allowanceType: record.allowanceType,
    //       balance: balance,
    //       records: [],
    //     };
    //   }

    //   const records = leaveRecords.filter(
    //     (data) => data.leaveDetailId == record.id
    //   );

    //   if (records.length > 0) {
    //     const balance = records.reduce((acc, leave) => {
    //       return (
    //         acc -
    //         getDeducted(
    //           leave.start,
    //           leave.end,
    //           leave.startTime,
    //           leave.endTime ?? undefined
    //         )
    //       );
    //     }, record.allowance ?? 0);

    //     acc[record.id].balance = balance;
    //   }

    //   return acc;
    // }, {});
    const message = leaveDetailWithBalance
      .map(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (leave: any) => {
          const currentDetail = leave.detail.find((detail) => {
            return detail.year == new Date().getFullYear().toString();
          });

          return `${formatToSlackEmoji(leave.name)}: ${
            currentDetail?.balance ?? leave.allowance
          } days remaining`;
        }
      )
      .join("\n");

    await slackClient.chat.postEphemeral({
      channel: channelId,
      user : slackUser,
      text: `Here is your leave balance summary:\n${message}`,
    });
  } catch (error) {
    console.error("Error calculating leave balance:", error);
    // return NextResponse.json(
    //   { error: "Failed to calculate leave balance" },
    //   { status: 500 }
    // );
  }
}
