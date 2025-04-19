"use client";

import React from "react";
import Typography from "@/app/(dashboard)/_components/Typography";
import CalendarCuate from "@assets/CalendarCuate";
import GoogleCalendar from "@assets/GoogleCalendar";
import useUserStore from "@/store/user";
import {
  toastFullfilled,
  toastPending,
} from "@/app/(dashboard)/_components/Toast";

const CalendarConnect = () => {
  const { connectUpdateCalendarNotification, user } = useUserStore();

  return (
    <div className="flex items-center gap-6 bg-[#FCFCFD] p-6 border border-[#F2F4F7] shadow-sm rounded-lg">
      {/* Left Side: Image */}
      <div>
        <CalendarCuate />
      </div>

      {/* Right Side: Content */}
      <div className="pl-6">
        <Typography
          variant="heading1"
          text="It looks like your calendar isn’t connected yet!"
          className="font-[Mulish] text-[#1E2318] text-[18px] font-semibold leading-[28.8px]"
        />
        <div className="mt-2">
          <Typography
            variant="paragraph1"
            text="Why connect?"
            className="font-[Mulish] text-[#667085] text-[16px]  leading-[24px]"
          />
          <ul className="mt-2 ml-4 space-y-2 list-disc text-[#667085]">
            <li>
              <Typography
                variant="paragraph3"
                text="Sync your time-off with work schedules"
                className="font-[Mulish] text-[#667085] text-[14px] font-normal leading-[21px]"
              />
            </li>
            <li>
              <Typography
                variant="paragraph3"
                text="Keep things smooth—no clashes, no chaos"
                className="font-[Mulish] text-[#667085] text-[14px] font-normal leading-[21px]"
              />
            </li>
            <li>
              <Typography
                variant="paragraph3"
                text="One spot for all your plans"
                className="font-[Mulish] text-[#667085] text-[14px] font-normal leading-[21px]"
              />
            </li>
          </ul>
        </div>

        {/* Google Calendar Button */}
        <button
          onClick={async () => {
            const toastId = toastPending("Connecting calendar...");
            const res = await connectUpdateCalendarNotification({
              userId: user?.id ?? "",
              googleNotification: true,
            });

            toastFullfilled(
              toastId,
              res,
              "Calendar connected successfully...",
              "Error connecting calender.."
            );
          }}
          className="flex items-center gap-3 mt-6 px-4 py-2 border border-[#D0D5DD] shadow-sm rounded-lg"
        >
          <div className="flex-col text-left">
            <Typography
              variant="label"
              text="CONNECT WITH"
              className="font-[Mulish]  text-[#344054] leading-[22px]"
            />
            <Typography
              variant="paragraph1"
              text="Google Calendar"
              className="font-[Mulish]  text-[#000000] leading-[22px]"
            />
          </div>
          <GoogleCalendar size={32} />
        </button>
      </div>
    </div>
  );
};

export default CalendarConnect;
