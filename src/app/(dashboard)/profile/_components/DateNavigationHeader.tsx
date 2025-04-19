"use client";

import { CircleArrowLeft, CircleArrowRight } from "lucide-react";
import Typography from "@/app/(dashboard)/_components/Typography";
import { Dispatch, SetStateAction } from "react";

const DateNavigationHeader = ({
  dateRange,
  setDateRange,
}: {
  dateRange: number;
  setDateRange: Dispatch<SetStateAction<number>>;
}) => {
  const handlePreviousDateRange = () => {
    setDateRange(dateRange - 1);
  };

  const handleNextDateRange = () => {
    if (dateRange == new Date().getFullYear()) {
      return;
    }
    setDateRange(dateRange + 1);
  };

  return (
    <div className="flex justify-between items-center p-4 bg-white border-b border-[#EAECF0]">
      <div className="flex items-center gap-2">
        <button
          className="p-1 rounded-full hover:bg-gray-100"
          onClick={handlePreviousDateRange}
        >
          <CircleArrowLeft className="text-[#7E8475] w-5 h-5" />
        </button>
        <Typography
          text={"Jan - Dec " + dateRange.toString()}
          variant="heading1"
          className="font-semibold text-[#3D4630]"
        />

        <button
          className="p-1 rounded-full hover:bg-gray-100"
          onClick={handleNextDateRange}
        >
          <CircleArrowRight className="text-[#7E8475] w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default DateNavigationHeader;
