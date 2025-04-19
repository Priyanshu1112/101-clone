"use client";
import useUserStore, { CustomUpdateResponse } from "@/store/user";
import UpdateCard from "./_components/UpdateCard";
import dayjs from "dayjs";
import useCalendarStore from "@/store/calendar";
import { useMemo, useState } from "react";
import useWorkdayStore from "@/store/workday";
import Flag from "@/assets/Flag";
import { Event } from "@types";

export interface UpdateCard {
  date: string;
  eventBody: Event[] | null;
  weekOff: boolean;
  response: CustomUpdateResponse[] | null;
}

const Updates = () => {
  const { updateResponse } = useUserStore();
  const { events } = useCalendarStore();
  const { workday } = useWorkdayStore();
  const [formattingData, setFormattingData] = useState(false);

  const updates: UpdateCard[] = useMemo(() => {
    setFormattingData(true);
    const today = dayjs();
    const startOfYear = dayjs(`${today.year()}-01-01`);

    // Calculate days difference from today to Jan 1
    const daysDiff = today.diff(startOfYear, "day") + 1;

    // Generate dates in reverse order
    const dates = Array.from({ length: daysDiff }, (_, ind) =>
      today.subtract(ind, "day").format("MMM D, ddd")
    );

    const updateBody = dates.map((data) => {
      const [date, day] = data.split(", ");
      const eventBody = events?.filter((event) => {
        return dayjs(event.date, "MMM D").isSame(dayjs(date, "MMM D"));
      });

      const weekOff = workday?.weekOff?.find((off) => off.includes(day));

      const response = updateResponse?.filter((res) => {
        return dayjs(res.createdAt).format("MMM D") == date;
      });
      return {
        date: data,
        eventBody: eventBody.length > 0 ? eventBody : null,
        weekOff: weekOff ? true : false,
        response: (response?.length ?? 0) > 0 ? response ?? null : null,
      };
    });

    setFormattingData(false);

    return updateBody;
  }, [updateResponse, events, workday]);

  return (
    <div className="relative w-full flex flex-col">
      <div className="absolute top-9 left-[calc(100px+6px)] h-full w-[4px] bg-gradient-to-b from-[rgba(126,132,117,0.1)] to-[#7E8475] z-[-2]"></div>
      {updates?.map((update, index) => (
        <div key={index} className="relative flex gap-9 items-center ">
          <span className="flex gap-3 min-w-[100px] items-center  min-h-7 py-9">
            {update.date}
          </span>
          <div className="absolute top-0 translate-x-[calc(100px+4px)] translate-y-12 w-2 h-2 bg-[#B0B4AC]  rounded-full border-white"></div>
          {formattingData ? (
            ""
          ) : (
            <div className="flex gap-3 flex-1 overflow-x-auto no-scrollbar px-2 py-9">
              {update.eventBody ? (
                <div className="min-h-7 border rounded min-w-full bg-main-200 text-main-600 flex gap-2 items-center px-3 py-1 font-semibold">
                  <Flag size={20} /> {update.eventBody[0].occasion}
                </div>
              ) : update.weekOff ? (
                <div className="min-h-7 border rounded border-grey-300 min-w-full bg-grey-200"></div>
              ) : update.response ? (
                update.response.map((response) => (
                  <UpdateCard key={response.id} response={response} />
                ))
              ) : (
                <div className="min-h-7 border rounded border-grey-300 min-w-full bg-grey-200"></div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Updates;
