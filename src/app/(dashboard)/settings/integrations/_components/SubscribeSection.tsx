import React from "react";
import Typography from "@/app/(dashboard)/_components/Typography";

const TeamCalendarSubscription: React.FC = () => {
  return (
<div className="bg-[#FCFCFD] border border-[#EAECF0] shadow-[0px_1px_2px_0px_#1018280D] rounded-lg overflow-hidden">
      {/* Top Section: Title and Sub-Link */}
      <div className="p-6 border-b bg-[#FCFCFD]">
        <Typography
          text="Subscribe to teams' leaves calendars"
          variant="paragraph1"
          className="font-bold text-[18px] leading-[28.8px] text-gray-800"
        />
        <Typography
          text="How to subscribe to a calendar?"
          variant="label"
          className="font-semibold text-[12px] leading-[19.68px] text-[#667085] underline decoration-solid"
        />
      </div>

      {/* Bottom Section: Select Team and Action Buttons */}
      <div className="p-6 bg-white flex flex-col lg:flex-row gap-10">
        {/* Left Section: Select Team */}
        <div className="w-full lg:w-1/2">
        <Typography
            text="Select team"
            variant="paragraph3"
            className="font-semibold text-[14px] leading-[22.96px] text-[#667085] mb-3"
          />
          <select
            id="teamSelect"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 text-[16px] leading-[25.6px] focus:outline-none focus:ring-1 focus:ring-gray-400"
          >
            <option value="" className="text-[16px] leading-[25.6px]">
              Select
            </option>
            <option value="design" className="text-[16px] leading-[25.6px]">
              Design Team
            </option>
            <option value="development" className="text-[16px] leading-[25.6px]">
              Development Team
            </option>
          </select>
        </div>

        {/* Right Section: Buttons */}
        <div className="flex flex-col pt-8 lg:flex-row gap-4 lg:w-1/2 ">
          <button
className="w-full px-6 py-3 bg-[#F2F4F7] text-gray-400 border border-[#EAECF0] rounded-lg cursor-not-allowed shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]"
            disabled
          >
            <Typography
              text="Add to G-Cal"
              variant="paragraph2"
              className="font-semibold text-[16px] leading-[25.6px] text-gray-400"
            />
          </button>
          <button
className="w-full px-6 py-3 bg-[#F2F4F7] text-gray-400 border border-[#EAECF0] rounded-lg cursor-not-allowed shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]"
            disabled
          >
            <Typography
              text="Download .ICS"
              variant="paragraph2"
              className="font-semibold text-[16px] leading-[25.6px] text-gray-400"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamCalendarSubscription;