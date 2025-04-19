import React from "react";
import Typography from "@/app/(dashboard)/_components/Typography";
import GoogleCalendar from "@/assets/GoogleCalendar";
import DisconnectButton from "./DisconnectButton";

const CalendarSection = () => {
  return (
    <div className="p-6 bg-[#FCFCFD] border border-[#F2F4F7] rounded-lg flex justify-between items-center">
      {/* Left Section: Calendar Icon and Text */}
      <div className="flex items-center gap-4">
        {/* Google Calendar Icon */}
        <div className="w-12 h-12 flex items-center justify-center bg-white rounded-md shadow">
          <GoogleCalendar />
        </div>

        {/* Text Information */}
        <div>
          <Typography
            text="Calendar is connected"
            variant="paragraph1"
            className="font-semibold text-[#1E2318] text-lg"
          />
          <Typography
            text='Your "Google Calendar" is connected'
            variant="paragraph2"
            className="text-[#667085] text-sm mt-1"
          />
        </div>
      </div>

      {/* Right Section: Disconnect Button */}
      <DisconnectButton label="Disconnect" />
  
    </div>
  );
};

export default CalendarSection;