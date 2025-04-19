"use client";
import React from "react";
import Calendar from "./_components/Calendar";
import LeaveDetails from "./_components/LeaveDetails";
import useAppStore from "@/store/app";
// import useCalendarStore from "@/store/calendar";

const Leave = () => {
  const { navbarHeight } = useAppStore();

  return (
    <div
      className="flex gap-9 overflow-auto no-scrollbar"
      style={{
        height: `calc(100dvh - ${navbarHeight + 50}px)`,
      }}
    >
      <div className="sticky top-0">
        <LeaveDetails />
      </div>
      <div className="min-w-[964px] flex-1 relative">
        <Calendar />
      </div>
    </div>
  );
};

export default Leave;
