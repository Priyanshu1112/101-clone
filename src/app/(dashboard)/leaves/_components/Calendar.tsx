"use client";

import * as React from "react";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import weekday from "dayjs/plugin/weekday";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

import useCalendarStore from "@/store/calendar";
import MonthlyView from "./MonthlyView";
import WeeklyView from "./WeeklyView";

dayjs.extend(advancedFormat);
dayjs.extend(weekday);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

export default function Calendar() {
  const { isMonthlyView } = useCalendarStore();

  return (
    <div className="w-full rounded-[11px] border border-grey-300 overflow-hidden relative">
      {isMonthlyView ? <MonthlyView /> : <WeeklyView />}
    </div>
  );
}

export function getWorkDays(
  startOfWeek: string,
  weekOff: string[],
  hideWeekend = false
): string[] {
  const allDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const startIndex = allDays.indexOf(startOfWeek);
  const orderedDays = [
    ...allDays.slice(startIndex),
    ...allDays.slice(0, startIndex),
  ];

  const workDays = orderedDays.filter((day) => !weekOff.includes(day));

  if (!hideWeekend) return orderedDays;

  return workDays.map((day) => day.slice(0, 3));
}
