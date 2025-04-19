import React from "react";
import SlackSection from "./SlackSection";
import SlackSettings from "./SlackSettings";
import SlackConnect from "./SlackConnect";
import useUserStore from "@/store/user";
import { Role } from "@prisma/client";

const CalendarPreferences = () => {
  const { company, user } = useUserStore();

  return (
    <div className="space-y-6">
      {company?.slackNotification ? (
        <>
          {" "}
          <SlackSection />
          {user?.role == Role.Administrator && <SlackSettings />}
        </>
      ) : (
        <SlackConnect />
      )}
    </div>
  );
};

export default CalendarPreferences;
