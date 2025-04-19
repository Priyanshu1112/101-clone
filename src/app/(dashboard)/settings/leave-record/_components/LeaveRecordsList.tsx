"use client";

import LeaveRecordHeader from "./LeaveRecordHeader";
import Leaves from "./Leaves";
import useLeaveStore from "@/store/leave";
import { useMemo, useState } from "react";
import dayjs from "dayjs";
import { LeaveStatus, LeaveTime } from "@prisma/client";
import { getDeducted } from "@/utils/helpers/getDeductes";

export interface CustomLeaveRecord {
  id: string;
  date: string;
  deducted: string;
  type: string;
  status: LeaveStatus;
  approver: string;
  start: string;
}

export const getLeaveTime = (time, word = false) => {
  if (time == LeaveTime.FIRST_HALF) return word ? "First half" : "1st half";
  else if (time == LeaveTime.SECOND_HALF)
    return word ? "Second half" : "2nd half";
  else return "Full day";
};

const filterDateRange = (leaves: CustomLeaveRecord[], dateRange: number) => {
  return leaves.filter((leave) => {
    const startYear = dayjs(leave.start).year();
    return startYear === dateRange;
  });
};

const LeaveRecordList = () => {
  const [dateRange, setDateRange] = useState(new Date().getFullYear());
  const { leaveRecords } = useLeaveStore();
  const recordDetails = useMemo(() => {
    const upcoming: CustomLeaveRecord[] = [];
    const past: CustomLeaveRecord[] = [];

    leaveRecords?.forEach((record) => {
      // const type = record.leaveDetail.name;

      const startDate = dayjs(record.start).format("MMM D");
      const endDate = dayjs(record.end).format("MMM D");
      const isEndDateValid = dayjs(record.end).isValid();

      const date = isEndDateValid
        ? startDate + " - " + endDate
        : startDate + ", " + getLeaveTime(record.startTime);

      const deducted = getDeducted(
        record.start,
        record.end,
        record.startTime,
        record.endTime,
        isEndDateValid
      ).toString();

      const leave: CustomLeaveRecord = {
        id: record.id,
        status: record.status,
        date,
        deducted,
        approver: record.approvedBy?.name,
        type: record.leaveDetail.name,
        start: record.start,
      };
      const recordStartDate = new Date(record.start);
      if (recordStartDate < new Date()) {
        past.push(leave);
      } else {
        upcoming.push(leave);
      }
    });

    return {
      upcoming: filterDateRange(upcoming, dateRange),
      past: filterDateRange(past, dateRange),
    };
  }, [leaveRecords, dateRange]);

  return (
    <div className="flex flex-col w-full p-6 bg-white rounded shadow">
      <LeaveRecordHeader dateRange={dateRange} setDateRange={setDateRange} />
      <Leaves title="Upcoming" leaveRecords={recordDetails.upcoming} />
      <Leaves title="Past" leaveRecords={recordDetails.past} />
    </div>
  );
};

export default LeaveRecordList;
