"use client";
import React, { useState } from "react";
import Typography from "../../_components/Typography";
import useCalendarStore from "@/store/calendar";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import CalendarTick from "@/assets/CalendarTick";
import Flag from "@/assets/Flag";
import { cn } from "@/lib/utils";
import { calendarCodes } from "@/utils/constant/calendarCodes";
import { EventType } from "@types";
import useWorkdayStore from "@/store/workday";
import { getWorkDays } from "./Calendar";
import useUserStore from "@/store/user";
import { WeekDay } from "@prisma/client";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import EventDetail from "./EventDetail";
import LeaveFormTrigger from "./LeaveFormTrigger";
import Birthday from "@/assets/BirthdayCake";
import { Rocket } from "lucide-react";
// import { toast } from "sonner";

dayjs.extend(isBetween);

const MonthlyView = () => {
  const { user } = useUserStore();
  const { currentDate, events, hideWeekend, onlyMyLeaves, setActiveEvent } =
    useCalendarStore();
  const { workday } = useWorkdayStore();

  const [eventSheetOpen, setEventSheetOpen] = useState(false);
  const [leaveForm, setLeaveForm] = useState(false);
  const [date, setDate] = useState("");

  const dayMap = {
    Monday: 0,
    Tuesday: 1,
    Wednesday: 2,
    Thursday: 3,
    Friday: 4,
    Saturday: 5,
    Sunday: 6,
  };

  const weeks = React.useMemo(() => {
    const getEventsForWeek = (weekStart, weekEnd, date) => {
      return events.filter((event) => {
        // console.log(event.id, event.type);
        const eventStart = dayjs(event.start);
        const eventEnd = dayjs(event.end ?? event.start);

        return date.isBetween(eventStart, eventEnd, "day", "[]");
      });
    };

    // Map day names to dayjs day indices

    const startOfWeekIndex = workday?.startOfWeek
      ? dayMap[workday.startOfWeek]
      : 0; // Default to Sunday if not provided

    const startOfMonth = currentDate.startOf("month");

    // Adjust start based on startOfWeek
    const start = startOfMonth.subtract(
      ((startOfMonth.day() - startOfWeekIndex + 7) % 7) - 1,
      "day"
    );

    return Array.from({ length: 6 }).map((_, weekIndex) => {
      const weekStart = start.add(weekIndex * 7, "day");
      const weekEnd = weekStart.add(6, "day");

      return Array.from({ length: 7 })
        .map((_, dayIndex) => {
          const date = weekStart.add(dayIndex, "day");

          const eventsForWeek = getEventsForWeek(weekStart, weekEnd, date);

          const sortedEvents = [...eventsForWeek].sort((a, b) => {
            const aDuration = dayjs(a.end).diff(dayjs(a.start), "days");
            const bDuration = dayjs(b.end).diff(dayjs(b.start), "days");
            if (bDuration !== aDuration) return bDuration - aDuration;
            return dayjs(a.start).diff(dayjs(b.start));
          });

          return {
            date,
            events: sortedEvents,
          };
        })
        .filter(Boolean); // Remove null days
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDate, events, workday]);

  const getWeekStartAndEnd = (date) => {
    const week = weeks.find((w) =>
      date.isBetween(w[0].date, w[6].date, "date", "[]")
    );

    if (week) {
      return { weekStart: week[0].date, weekEnd: week[6].date };
    }
    return { weekStart: date, weekEnd: date };
  };

  const renderEvent = (event, date, index) => {
    if (onlyMyLeaves) {
      if (event.type == ("HOLIDAY" as unknown as EventType)) return;
      else if (event.userId != user?.id) return;
    }

    const { weekEnd, weekStart } = getWeekStartAndEnd(date);

    if (event.type == "LEAVE" && event.status == "REJECTED") return;

    const start = dayjs(event.start, "YYYY-MM-DD");
    const end = event.end ? dayjs(event.end, "YYYY-MM-DD") : start;

    // Reduce the end date by one day for holidays
    // if (event.type === ("HOLIDAY" as unknown as EventType)) {
    //   // end = end.subtract(1, "day").clone();
    // }

    const multiWeek = !(
      dayjs(start).isBetween(weekStart, weekEnd, "date", "[]") &&
      dayjs(end).isBetween(weekStart, weekEnd, "date", "[]")
    );

    const [isFirstDay, isWeekStart, isEndWeek] = [
      date.isSame(start, "day"),
      date.isSame(weekStart),
      end.isBetween(weekStart, weekEnd, "date", "[]"),
    ];

    if (!isFirstDay && !isWeekStart) return null;

    let colorClasses: { bg: string; text: string } = { bg: "", text: "" };

    const isHoliday = event.type == ("HOLIDAY" as unknown as EventType);
    const isBirtdayOrAnni =
      event.type == ("BIRTHDAY" as unknown as EventType) ||
      event.type == ("WORK_ANNIVERSARY" as unknown as EventType);

    const daysUntilWeekEnd = end.isValid()
      ? (multiWeek
          ? end?.isBetween(weekStart, weekEnd, "date", "[]")
            ? end
            : weekEnd
          : end
        ).diff(date, "days") + 1
      : 1;

    if (!isHoliday) {
      colorClasses = calendarCodes[event.colorCode];
    }
    const startDate = dayjs(event.start).format("MMM D");
    const endDate = dayjs(event.end).format("MMM D"); // Use the original end date for the title

    const isCurrentMonth = start.month() === currentDate.month();

    return (
      <div
        data-value={"event|" + event.id + "|" + event.type}
        key={event.id}
        className={cn(
          `absolute px-2 py-1 text-sm truncate  h-7 ${
            !isCurrentMonth && "opacity-60"
          }`,
          event.type == "LEAVE" ? "cursor-pointer" : "cursor-default",
          event.type === "HOLIDAY" && "bg-main-200 text-main-600",
          event.type == "LEAVE" &&
            (multiWeek
              ? isFirstDay && isEndWeek
                ? "rounded-[41px]"
                : isFirstDay
                ? "rounded-s-[41px]"
                : isEndWeek
                ? "rounded-e-[41px]"
                : ""
              : "rounded-[41px]"),
          isBirtdayOrAnni && "rounded-[41px]"
        )}
        style={{
          width: `calc(${daysUntilWeekEnd * 100}% + ${
            (daysUntilWeekEnd - 1) * 16
          }px)`,
          top: `${index * 32}px`,
          zIndex: 10,
          ...(event.type !== "HOLIDAY" && {
            background: !isBirtdayOrAnni
              ? colorClasses?.bg ?? "unset"
              : "#7D803E",
            color: !isBirtdayOrAnni ? colorClasses?.text ?? "unset" : "#FEFFE5",
            border:
              event.status == "PENDING"
                ? "1px dashed #A73F07"
                : `1px solid ${colorClasses.bg}`,
          }),
        }}
        title={`${event.occasion} ${
          isHoliday
            ? event.date
            : !isBirtdayOrAnni
            ? `(${startDate} ${
                end.isValid() && !endDate.includes("Invalid")
                  ? `- ${endDate}`
                  : ""
              })`
            : ""
        }`}
      >
        {!isHoliday && !isBirtdayOrAnni && (
          <>
            {!isWeekStart && event.startTime === "SECOND_HALF" && (
              <div
                title="Second half"
                className="z-10 absolute top-0 left-0 min-h-full bg-white"
                style={{
                  width: `calc(${100 / (daysUntilWeekEnd * 2)}%)`,
                }}
              ></div>
            )}
            {!isWeekStart &&
              event.startTime === "FIRST_HALF" &&
              !event.endTime && (
                <div
                  className="z-10 absolute min-h-full top-0 right-0 bg-white"
                  title="Second half"
                  style={{
                    width: `calc(${100 / (daysUntilWeekEnd * 2)}%)`,
                  }}
                ></div>
              )}
            {isEndWeek && event.endTime === "FIRST_HALF" && (
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

        {isBirtdayOrAnni ? (
          <div className="flex gap-1 items-center relative z-40">
            <div>
              {event.type == "WORK_ANNIVERSARY" ? (
                <Rocket size={14} />
              ) : (
                <Birthday />
              )}
            </div>
            <Typography
              variant="paragraph3"
              text={
                event.type == "WORK_ANNIVERSARY"
                  ? event.name.split(" ")[0] + "-" + event.exp + "yrs"
                  : event.name
              }
              className="font-bold truncate capitalize"
            />
          </div>
        ) : (
          <div className="flex gap-1 items-center relative z-40">
            <div>
              {event.type !== "HOLIDAY" ? (
                <CalendarTick size={14} color={colorClasses.text} />
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
        )}
      </div>
    );
  };

  const handleEventClick = (e) => {
    e.stopPropagation();

    const [type, id, eventType] = e.target
      .closest("[data-value]")
      .dataset.value.split("|");

    if (type == "date") {
      // if (id == dayjs().format("YYYY-MM-DD") || dayjs(id).isAfter(dayjs())) {
      setDate(id);
      setLeaveForm(true);
      // } else {
      // toast.info("Cannot apply for previous date!");
      // }
    } else if (id && eventType == "LEAVE") {
      setActiveEvent(id);
      setEventSheetOpen(true);
    }
  };

  let daysOfWeek: string[] = [];
  if (workday) {
    daysOfWeek = hideWeekend
      ? getWorkDays(workday.startOfWeek, workday.weekOff, true)
      : getWorkDays(workday.startOfWeek, workday.weekOff, false);
  } else {
    daysOfWeek = hideWeekend
      ? getWorkDays("Monday", ["Saturday", "Sunday"], true)
      : getWorkDays("Monday", ["Saturday", "Sunday"], false);
  }

  const filteredWeeks = weeks.map((week) => {
    if (week) {
      return hideWeekend
        ? week.filter(({ date }) => {
            const weekDay = date.format("dddd");
            return workday
              ? !workday?.weekOff.includes(weekDay as WeekDay)
              : !["Sunday", "Saturday"].includes(weekDay);
          })
        : week;
    }
  });

  return (
    <>
      <div
        className={`grid pb-1 border-b border-grey-300`}
        style={{
          gridTemplateColumns: `repeat(${daysOfWeek.length ?? 7}, 1fr)`,
        }}
      >
        {daysOfWeek.map((day, index) => {
          return (
            <span key={index} className="pt-4 px-3 ml-auto">
              <Typography
                text={day.slice(0, 3)}
                variant="label"
                className="uppercase w-[3ch]"
              />
            </span>
          );
        })}
      </div>
      <div
        className={`grid grid-rows-1  border-t border-l relative`}
        style={{
          gridTemplateColumns: `repeat(${daysOfWeek.length ?? 7}, 1fr)`,
        }}
      >
        {filteredWeeks.map((week) => {
          return week?.map(({ date, events }) => {
            const isToday = date.isSame(new Date(), "day");
            const isCurrentMonth = date.month() === currentDate.month();
            const weekDay = date.format("dddd");
            const isWeekoff = workday
              ? workday?.weekOff.includes(weekDay as WeekDay)
              : ["Sunday", "Saturday"].includes(weekDay);

            return (
              <div
                key={date.toISOString()}
                data-value={"date|" + date.format("YYYY-MM-DD")}
                onClick={handleEventClick}
                className={`relative min-h-28 p-2 border-r border-b cursor-pointer
                    ${isToday && "bg-main-100"}
                    ${isWeekoff && "bg-grey-200"}
                  `}
              >
                {/* Date Display */}
                {isToday ? (
                  <div className="text-right flex justify-end">
                    <span className="bg-secondary-400-main rounded-full size-7 flex justify-center items-center">
                      <time
                        dateTime={date.format("YYYY-MM-DD")}
                        className={`text-white text-sm font-bold leading-160`}
                      >
                        {date.format("D")}
                      </time>
                    </span>
                  </div>
                ) : (
                  <time
                    dateTime={date.format("YYYY-MM-DD")}
                    className={`block text-right text-xl font-semibold leading-160 text-grey/400 ${
                      !isCurrentMonth && "opacity-40"
                    }`}
                  >
                    {date.format("D")}
                  </time>
                )}

                {/* Events List */}
                <div
                  className="relative mt-2 flex flex-col gap-2"
                  style={{
                    minHeight: events.length
                      ? `${events.length * 32 + 8}px`
                      : "auto",
                  }}
                >
                  {events.map((event, index) =>
                    renderEvent(event, date, index)
                  )}
                </div>
              </div>
            );
          });
        })}
      </div>
      <Sheet open={eventSheetOpen} onOpenChange={(e) => setEventSheetOpen(e)}>
        <SheetContent className="p-0 min-w-fit flex flex-col">
          <SheetTitle className="py-4 px-6 border-gray-300 border-b">
            <Typography variant="display4" text={"Leave details"} />
          </SheetTitle>
          <EventDetail setOpen={setEventSheetOpen} />
        </SheetContent>
      </Sheet>

      <LeaveFormTrigger open={leaveForm} setOpen={setLeaveForm} date={date} />
    </>
  );
};

export default MonthlyView;
