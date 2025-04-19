import React from "react";
// import Typography from "@/app/(dashboard)/_components/Typography";
// import DisconnectButton from "./DisconnectButton";
// import NotificationOption from "./NotificationOption";
import CalendarSection from "./CalendarSection";
import CalendarSettings from "./CalendarSettings";
import SubscribeSection from "./SubscribeSection";

import CalendarConnect from "./CalendarConnect";
import useUserStore from "@/store/user";

const CalendarPreferences = () => {
  const { user } = useUserStore();
  return (
    <div className="space-y-6">
      {user?.googleNotification ? (
        <>
          <CalendarSection />
          <CalendarSettings />
          <SubscribeSection />
        </>
      ) : (
        <CalendarConnect />
      )}
    </div>
  );
};

export default CalendarPreferences;
