// import { prisma } from "@/service/prisma";
// import { getDeducted } from "@/utils/helpers/getDeductes";
// import { LeaveStatus } from "@prisma/client";
// import dayjs from "dayjs";

// export const getLeaveDetaillWithBalance = async ({
//   userId,
//   companyId,
// }: {
//   userId: string;
//   companyId: string;
// }) => {
//   const user = await prisma.user.findUnique({ where: { id: userId } });

//   // Fetch leave records based on user and company
//   const leaveRecords = await prisma.leaveRecord.findMany({
//     where: {
//       status: { not: LeaveStatus.REJECTED },
//       userId,
//       leaveDetail: {
//         companyId,
//       },
//     },
//   });

//   // Group leave records by leaveDetailId and year
//   const groupedLeaveRecords = leaveRecords.reduce((acc, record) => {
//     const year = new Date(record.start).getFullYear(); // Extract year
//     const { leaveDetailId } = record;

//     // Find existing record for leaveDetailId in the accumulator
//     let leaveDetail = acc.find((data) => data.leaveDetailId === leaveDetailId);

//     if (!leaveDetail) {
//       // If no entry exists, initialize it
//       leaveDetail = {
//         leaveDetailId,
//         details: {}, // To hold year-wise details
//       };
//       acc.push(leaveDetail);
//     }

//     // Initialize the year group if it doesn't exist
//     if (!leaveDetail.details[year]) {
//       leaveDetail.details[year] = {
//         year: year.toString(),
//         taken: 0,
//       };
//     }

//     const isEndDateValid = dayjs(record.end).isValid();

//     const deducted = getDeducted(
//       record.start,
//       record.end,
//       record.startTime,
//       record.endTime ?? undefined,
//       isEndDateValid
//     );

//     // Increment the 'taken' count for the year
//     leaveDetail.details[year].taken += deducted;

//     return acc;
//   }, [] as { leaveDetailId: string; details: Record<number, { year: string; taken: number }> }[]);

//   // Transform into a more usable structure with balance inside yearlyDetails
//   const formattedResult = groupedLeaveRecords.map((leaveDetail) => ({
//     leaveDetailId: leaveDetail.leaveDetailId,
//     details: Object.values(leaveDetail.details).map((detail) => ({
//       ...detail,
//     })),
//   }));

//   // Fetch leave detail information from database
//   const leaveDetail = await prisma.leaveDetail.findMany({
//     where: { companyId },
//     select: {
//       id: true,
//       name: true,
//       unlimited: true,
//       type: true,
//       allowance: true,
//       allowanceType: true,
//     },
//   });

//   // Prepare final leave details with balance inside yearlyDetails
//   const leaveDetailWithBalance = leaveDetail.map((detail) => {
//     const record = formattedResult.find(
//       (result) => result.leaveDetailId == detail.id
//     );

//     // Transform the details from an object to an array format
//     const body = Object.values(record?.details || {}).map((yearDetail) => ({
//       year: yearDetail.year,
//       taken: yearDetail.taken,
//       balance: detail.unlimited
//         ? "Unlimited"
//         : Math.max((detail.allowance ?? 0) - (yearDetail.taken ?? 0), 0), // Calculate balance
//     }));

//     return { ...detail, detail: body };
//   });

//   return leaveDetailWithBalance.filter((data) => {
//     if (data.name.includes("Menstrual")) {
//       return user?.gender == "Female";
//     } else return true;
//   });
// };

import { prisma } from "@/service/prisma";
import { getDeducted } from "@/utils/helpers/getDeductes";
import { LeaveStatus } from "@prisma/client";
import dayjs from "dayjs";

export const getLeaveDetaillWithBalance = async ({
  userId,
  companyId,
}: {
  userId: string;
  companyId: string;
}) => {
  // Fetch user and leave details in parallel
  const [user, leaveDetail] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.leaveDetail.findMany({
      where: { companyId },
      select: {
        id: true,
        name: true,
        unlimited: true,
        type: true,
        allowance: true,
        allowanceType: true,
      },
    }),
  ]);

  // Fetch leave records based on user and company
  const leaveRecords = await prisma.leaveRecord.findMany({
    where: {
      status: { not: LeaveStatus.REJECTED },
      userId,
      leaveDetail: { companyId },
    },
  });

  // Create a map for faster lookups
  const leaveDetailMap = new Map<
    string,
    Map<number, { year: string; taken: number }>
  >();

  // Process leave records
  for (const record of leaveRecords) {
    const year = new Date(record.start).getFullYear();
    const { leaveDetailId } = record;

    // Get or create the record for this leave detail
    if (!leaveDetailMap.has(leaveDetailId)) {
      leaveDetailMap.set(leaveDetailId, new Map());
    }

    const yearMap = leaveDetailMap.get(leaveDetailId)!;

    // Initialize year data if it doesn't exist
    if (!yearMap.has(year)) {
      yearMap.set(year, { year: year.toString(), taken: 0 });
    }

    // Calculate deducted days
    const isEndDateValid = dayjs(record.end).isValid();
    const deducted = getDeducted(
      record.start,
      record.end,
      record.startTime,
      record.endTime ?? undefined,
      isEndDateValid
    );

    // Update taken days
    const yearData = yearMap.get(year)!;
    yearData.taken += deducted;
  }

  // Process leave details with balance calculation
  const leaveDetailWithBalance = leaveDetail.map((detail) => {
    const yearMap = leaveDetailMap.get(detail.id) || new Map();

    const body = Array.from(yearMap.values()).map((yearData) => ({
      year: yearData.year,
      taken: yearData.taken,
      balance: detail.unlimited
        ? "Unlimited"
        : Math.max((detail.allowance ?? 0) - yearData.taken, 0),
    }));

    return { ...detail, detail: body };
  });

  // Filter based on gender for Menstrual leave
  return leaveDetailWithBalance.filter(
    (data) => !data.name.includes("Menstrual") || user?.gender === "Female"
  );
};
