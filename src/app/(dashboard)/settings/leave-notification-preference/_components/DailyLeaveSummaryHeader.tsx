"use client";
import React, { useState } from "react";
import Typography from "@/app/(dashboard)/_components/Typography";
import useUserStore from "@/store/user";

const DailyLeaveSummaryHeader: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { user } = useUserStore();

  return (
    <div className="p-4 bg-gray-50 border border-gray-100 rounded-t-lg border-b-0">
      <div className="flex justify-between items-center">
        {/* Header Title */}
        <Typography
          text="Daily leave summaries"
          variant="paragraph1"
          className="font-bold text-[#101828]"
        />

        {/* Button with Typography */}

        {/* <button className="px-4 py-2 rounded-md hover:bg-gray-200">
          <Typography
            text="+ Add new"
            variant="paragraph1"
            className="text-gray-800 font-medium"
          />
        </button> */}
      </div>

      {/* Subtext Link */}

      <Typography
        text="This will provide daily leave updates for the team"
        variant="label"
        className="text-[#667085]   "
      />
    </div>
  );
};

export default DailyLeaveSummaryHeader;
