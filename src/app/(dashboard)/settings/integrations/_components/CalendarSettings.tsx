import React from "react";
import Typography from "@/app/(dashboard)/_components/Typography";
// import DisconnectButton from "./DisconnectButton";
import NotificationOption from "./NotificationOption";

const CalendarSettings = () => {
  return (
    <div className="rounded-lg border border-[#F2F4F7] shadow-[0px_1px_2px_0px_#1018280D]">
      {/* Header Section */}
      <div className="p-6 bg-[#FCFCFD] rounded-t-lg border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <Typography
              text="Manage your Google Calendar"
              variant="heading1"
              className="text-gray-800 font-semibold"
            />
            <Typography
              text="To manage all your details at a one place"
              variant="paragraph3"
              className="text-gray-500 mt-1"
            />
          </div>
          
        </div>
      </div>

      {/* Notification Options */}
      <div className="px-6 space-y-6">
        <NotificationOption
          label="See your leaves in Google Calendar"
          description="How to see leaves in your G-Cal?"
          isEnabled={true}
          showCustomizeButton={false} 
        />
        <NotificationOption
          label="Auto-decline events in Google Calendar when you're on leave"
          description="How to auto-decline events?"
          isEnabled={true}
          showCustomizeButton={false} 
        />
        <NotificationOption
          label="Auto-decline events in Google Calendar on public holidays"
          description="How to auto-decline events?"
          isEnabled={false}
          showCustomizeButton={false}
        />
      </div>
    </div>
  );
};

export default CalendarSettings;