import React from "react";
import Typography from "@/app/(dashboard)/_components/Typography";
// import GoogleCalendar from "@/assets/GoogleCalendar";
import SlackIcon from '@assets/Slack'

import ManageIntegrationButton from "./ManageIntegrationButton.tsx";
const SlackSection = () => {
  return (
    <div className="p-6 bg-[#FCFCFD] border border-gray-200 rounded-lg flex justify-between items-center">
      {/* Left Section: Calendar Icon and Text */}
      <div className="flex items-center gap-4">
        {/* Google Calendar Icon */}
        
          <SlackIcon size={48} />
        

        {/* Text Information */}
        <div>
          <Typography
            text="Your slack is connected"
            variant="paragraph1"
            className="font-semibold text-[#1E2318] text-lg"
          />
          <Typography
            text='Leave Notification will be on "zazzy_internal"'
            variant="paragraph2"
            className="text-[#667085] text-sm mt-1"
          />
        </div>
      </div>

      {/* Right Section: Disconnect Button */}
      <ManageIntegrationButton label="manageIntegration" />
  
    </div>
  );
};

export default SlackSection;