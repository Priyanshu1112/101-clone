"use client";
import React, { useEffect, useState } from "react";
import HolidayPreferencesHeader from "./_components/HolidayPreferencesHeader";
import useCalendarStore from "@/store/calendar";
import EmptyField from "../_components/EmptyField";
import { Plus } from "lucide-react";
import AddEditCalendar, {
  AddEditCalendarType,
} from "./_components/AddEditCalendar";
import CalendarTable from "./_components/CalendarTable";

const Page = () => {
  const { calendar } = useCalendarStore();
  const [open, setOpen] = useState(false);

  const [isAddingCalendar, setIsAddingCalendar] = useState(false);

  useEffect(() => {
    setIsAddingCalendar(open);
  }, [open]);

  return (
    <div className="p-8 w-full border bg-white rounded-lg shadow-md">
      {calendar && calendar.length > 0 && !isAddingCalendar ? (
        <>
          <HolidayPreferencesHeader />
          <CalendarTable isCalendar={true} />
        </>
      ) : (
        <EmptyField
          title="Public Holidays"
          supportText="Easily manage and customize public holidays for your team!"
          message="It looks like you haven't set up your public holiday calendar yet!"
          Icon={Plus}
          buttonText="Setup public holidays calendar"
          content={
            <AddEditCalendar type={AddEditCalendarType.ADD} setOpen={setOpen} />
          }
          open={open}
          setOpen={setOpen}
        />
      )}
    </div>
  );
};

export default Page;
