import { LeaveTime } from "@prisma/client";

export const getDeducted = (
  startDate: string,
  endDate: string | null,
  startTime?: LeaveTime,
  endTime?: LeaveTime,
  isEndDateValid?: boolean
): number => {
  if (!isEndDateValid) {
    return startTime == LeaveTime.FULL_DAY ? 1 : 0.5;
  } else {
    const start = new Date(startDate);
    const end = new Date(endDate ?? "");

    // Normalize time to midnight for accurate day count
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    // Calculate the full number of days
    const msInDay = 1000 * 60 * 60 * 24;
    let diffInDays = (end.getTime() - start.getTime()) / msInDay + 1; // Add 1 to count both start & end days

    // Adjust for half-day leaves
    if (startTime === LeaveTime.SECOND_HALF) diffInDays -= 0.5;
    if (endTime === LeaveTime.FIRST_HALF) diffInDays -= 0.5;

    return Math.max(diffInDays, 0.5); // Ensure minimum 0.5 days
  }
};
