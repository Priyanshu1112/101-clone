"use client";

import React from "react";
import Typography from "../../_components/Typography";
import useCalendarStore from "@/store/calendar";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import minMax from "dayjs/plugin/minMax";
import {  EventType } from "@types";
import { cn } from "@/lib/utils";
import CalendarTick from "@/assets/CalendarTick";
import Flag from "@/assets/Flag";
import useUserStore from "@/store/user";
import { calendarCodes } from "@/utils/constant/calendarCodes";
dayjs.extend(isBetween);
dayjs.extend(minMax);

const WeeklyView = () => {
  const { currentDate, events,hideWeekend, onlyMyLeaves } = useCalendarStore();
  const { user } = useUserStore();
  // Get the start of the current week (Monday) and generate week days
  const startOfWeek = currentDate.startOf("week").add(1, "day");
  const weekDays = React.useMemo(
    () => Array.from({ length: 7 }).map((_, i) => startOfWeek.add(i, "day")),
    [startOfWeek]
  );
  const renderEvent = (event, date, index) => {
    if (onlyMyLeaves) {
      if (event.type == ("HOLIDAY" as unknown as EventType)) return;
      else if (event.userId != user?.id) return;
    }

    const start = dayjs(event.start);
    const end = event.end ? dayjs(event.end) : start;


    // Reduce the end date by one day for holidays
    // if (event.type === ("HOLIDAY" as unknown as EventType)) {
    //   end = end.subtract(1, "day");
    // }

    const isFirstDay = date.isSame(start, "day");

    if (!isFirstDay) return null;

    let colorClasses: { bg: string; text: string } = { bg: "", text: "" };

    const isHoliday = event.type == ("HOLIDAY" as unknown as EventType);

   // if (!isHoliday) console.log(event);

    const currentWeekEnd = date.endOf("week");
    const daysUntilWeekEnd = isHoliday
      ? Math.min(
          end.diff(date, "days") + 1,
          currentWeekEnd.diff(date, "days") + 1
        )
      : end.isValid()
      ? Math.min(
          end.diff(date, "days") + 1,
          currentWeekEnd.diff(date, "days") + 1
        )
      : 1;

    if (!isHoliday) {
      colorClasses = calendarCodes[event.colorCode];
    }
    const startDate = dayjs(event.start).format("MMM D");
    const endDate = dayjs(event.end).format("MMM D"); // Use the original end date for the title

    const isCurrentMonth = start.month() === currentDate.month();

    return (
      <div
        key={event.id}
        className={cn(
          `absolute px-2 py-1 text-sm truncate cursor-pointer overflow-hidden rounded-[41px] h-7 ${
            !isCurrentMonth && "opacity-60"
          }`,
          event.type === "HOLIDAY" && "bg-main-200 text-main-600"
        )}
        style={{
          width: `calc(${daysUntilWeekEnd * 100}% + ${
            (daysUntilWeekEnd - 1) * 16
          }px)`,
          top: `${index * 32}px`,
          zIndex: 10,
          ...(event.type !== "HOLIDAY" && {
            background: colorClasses?.bg ?? "unset",
            color: colorClasses?.text ?? "unset",
            border: `1px solid ${colorClasses.bg}`,
          }),
        }}
        title={`${event.occasion} ${
          isHoliday
            ? event.date
            : `(${startDate} ${end.isValid() ? `- ${endDate}` : ""})`
        }`}
      >
        {!isHoliday && (
          <>
            {event.startTime === "SECOND_HALF" && (
              <div
                title="First half"
                className="z-10 absolute top-0 left-0 min-h-full bg-white"
                style={{
                  width: `calc(${100 / (daysUntilWeekEnd * 2)}%)`,
                }}
              ></div>
            )}
            {event.endTime === "FIRST_HALF" && (
              <div
                className="z-10 absolute min-h-full top-0 right-0 bg-white"
                title="Second half"
                style={{
                  width: `calc(${100 / (daysUntilWeekEnd * 2)}%)`,
                }}
              ></div>
            )}
          </>
        )}

        <div className="flex gap-1 items-center relative z-40">
          <div>
            {event.type !== "HOLIDAY" ? (
              <CalendarTick size={14} />
            ) : (
              <Flag size={14} />
            )}
          </div>
          <Typography
            variant="paragraph3"
            text={isHoliday ? event.occasion : event.name}
            className="font-bold truncate capitalize"
          />
        </div>
      </div>
    );
  };
  // Attach events to each date for efficient rendering
  const weekDaysWithEvents = React.useMemo(() => {
    return weekDays.map((day) => ({
      date: day,
      events: events.filter((event) => {
        const eventStart = dayjs(event.start);
        const eventEnd = dayjs(event.end);
        return day.isBetween(eventStart, eventEnd, "day", "[]");
      }),
    }));
  }, [weekDays, events]);
  console.log(weekDaysWithEvents, "weekDaysWithEvents");
  return (
    <div className="w-full">
      {/* Header: Week Days */}
      <div className="grid grid-cols-7 border-b pb-1">
        {weekDays.map((day, index) => {
          const isToday = day.isSame(new Date(), "day");

          return (
            <span
              key={index}
              className="pt-4 px-3 ml-auto flex items-center gap-1"
            >
              {isToday && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="6"
                  height="6"
                  viewBox="0 0 6 6"
                  fill="none"
                >
                  <circle cx="3" cy="3" r="3" fill="#3D4630" />
                </svg>
              )}
              <Typography
                text={`${day.format("D")} - ${day.format("ddd")}`}
                variant="label"
                className={`font-bold ${
                  isToday ? "text-secondary-400-main" : "text-grey/400"
                }`}
              />
            </span>
          );
        })}
      </div>

      {/* Body: Events for Each Day */}
      <div className="grid grid-cols-7 border-t border-l relative">
        {weekDaysWithEvents.map(({ date, events }) => {
          const isToday = date.isSame(new Date(), "day");

          return (
            <div
              key={date.toISOString()}
              className={`p-2 border-r border-b min-h-[723px] ${
                isToday ? "bg-main-100" : "bg-white"
              }`}
            >
              {/* Render Events for the Day */}
              {/* <div className="mt-2 space-y-1">
                {events.map((event: Event, index: number) => {
                  const isHoliday =
                    event.type === ("HOLIDAY" as unknown as EventType.HOLIDAY);

                  const start = dayjs(event.start);
                  const end = dayjs(event.end);

                  // Check if the current day is the first day of the event within the week
                  const isFirstDay = date.isSame(start, "day");

                  if (!isFirstDay) return null; // Only render the event on its first day

                  // Determine the boundaries for the event
                  const effectiveEnd = dayjs.min(end, date.endOf("week"));

                  // Calculate the number of days the event spans within the current week
                  const eventDuration = effectiveEnd.diff(start, "days") + 1;

                  // Add styling classes
                  const colorClasses = isHoliday
                    ? "bg-main-200 text-main-600"
                    : `bg-cal${event.colorCode}/light text-cal${event.colorCode}/dark`;

                  const isCurrentMonth = start.month() === currentDate.month();

                  return (
                    <div
                      key={event.id}
                      className={cn(
                        `absolute rounded px-2 py-1 text-sm truncate cursor-pointer h-6 flex gap-1 items-center ${
                          !isCurrentMonth && "opacity-60"
                        }`,
                        colorClasses
                      )}
                      style={{
                        // Calculate the width based on the duration of the event
                        width: `calc(${eventDuration * 100}% + ${
                          (eventDuration - 1) * 4
                        }px)`,
                        top: `${index * 28}px`,
                        zIndex: 10,
                      }}
                      title={`${event.occasion || event.name} (${start.format(
                        "YYYY-MM-DD"
                      )} - ${end.format("YYYY-MM-DD")})`}
                    >
                      <div>
                        {!isHoliday ? (
                          <CalendarTick size={14} />
                        ) : (
                          <Flag size={14} />
                        )}
                      </div>
                      <Typography
                        variant="paragraph3"
                        text={isHoliday ? event.occasion : event.name}
                        className="font-bold truncate"
                      />
                    </div>
                  );
                })}
              </div> */}
               {/* Events List */}
               <div
                  className="relative mt-2 flex flex-col gap-2"
                  style={{ height: `${events.length * 32 + 8}px` }}
                >
                  {events.map((event, index) =>
                    renderEvent(event, date, index)
                  )}
                </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeeklyView;
