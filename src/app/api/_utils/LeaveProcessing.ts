/* eslint-disable @typescript-eslint/no-explicit-any */

import { LeaveTime } from "@prisma/client";
import dayjs from "dayjs";
import { getSlackTimestamp } from "../slack/status/route";

// Comprehensive leave processing service
export class LeaveProcessingService {
  // Validate date range
  static validateDateRange(startDate: Date, endDate: Date | null): boolean {
    return !endDate || startDate <= endDate;
  }

  // Format leave dates consistently
  static formatDate(date: Date | string): string {
    if (!date) return "";
    return new Intl.DateTimeFormat("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      weekday: "short",
    }).format(new Date(date));
  }

  // Determine leave time description
  static getLeaveTimeDescription(leaveRecord: any): string {
    if (leaveRecord.end) return "Full day";
    switch (leaveRecord.startTime) {
      case LeaveTime.FIRST_HALF:
        return "first half";
      case LeaveTime.SECOND_HALF:
        return "second half";
      default:
        return "Full day";
    }
  }

  // Determine expiration timestamp
  static calculateExpirationTimestamp(leaveRecord: any): number {
    const currentDate = dayjs().tz("Asia/Kolkata");

    if (leaveRecord.end) {
      return getSlackTimestamp(leaveRecord.end, leaveRecord.endTime);
    }

    return leaveRecord.startTime === LeaveTime.FIRST_HALF
      ? currentDate.set("hour", 13).set("minute", 0).unix()
      : currentDate.set("hour", 0).set("minute", 0).add(1, "day").unix();
  }
}
