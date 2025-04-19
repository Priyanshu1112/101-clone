"use client";
import React, { useState } from "react";
import Typography from "@/app/(dashboard)/_components/Typography";
import AddEditCalendar, { AddEditCalendarType } from "./AddEditCalendar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import useUserStore from "@/store/user";
import { Role } from "@prisma/client";

const HolidayPreferencesHeader: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { user } = useUserStore();

  return (
    <div className="p-6 bg-gray-50 border border-gray-100 rounded-t-lg border-b-0">
      <div className="flex justify-between items-center">
        {/* Header Title */}
        <Typography
          text="Public Holidays"
          variant="heading1"
          className="font-semibold text-gray-800"
        />

        {/* Button with Typography */}
        {user?.role == Role.Administrator && (
          <Sheet open={open} onOpenChange={(value) => setOpen(value)}>
            <SheetTrigger className="px-4 py-2 rounded-md hover:bg-gray-200">
              <Typography
                text="+ Add new"
                variant="paragraph1"
                className="text-gray-800 font-medium"
              />{" "}
            </SheetTrigger>
            <SheetContent className="p-0 min-w-[500px] flex flex-col overflow-y-auto overflow-x-hidden">
              <AddEditCalendar
                type={AddEditCalendarType.ADD}
                setOpen={setOpen}
              />
            </SheetContent>
          </Sheet>
        )}
        {/* <button className="px-4 py-2 rounded-md hover:bg-gray-200">
          <Typography
            text="+ Add new"
            variant="paragraph1"
            className="text-gray-800 font-medium"
          />
        </button> */}
      </div>

      {/* Subtext Link */}
      <a href="">
        {" "}
        <Typography
          text="How to setup PH Calendar"
          variant="paragraph3"
          className="text-gray-500 underline  cursor-pointer"
        />
      </a>
    </div>
  );
};

export default HolidayPreferencesHeader;
