"use client";

import React, { useState } from "react";
import Tabs from "./_components/Tabs";
import TeamSection from "./_components/TeamSection";
import useTeamStore from "@/store/team";
import { FetchStatus } from "@/store/leave";
import Typography from "../../_components/Typography";

const UpdateNotificationPreference = () => {
  const [activeTab, setActiveTab] = useState("all");
  const { teams, fetchTeam } = useTeamStore();

  return (
    <>
      {fetchTeam == FetchStatus.SUCCESS ? (
        <div className="p-8">
          {/* Tabs Section */}
          <div className="w-full overflow-x-auto no-scrollbar">
            <Tabs
              activeTab={activeTab}
              onTabChange={setActiveTab}
              teams={teams ?? []}
            />
          </div>

          {/* Team Sections */}
          <div className="mt-6 space-y-6 max-w-full">
            {teams?.map((team, idx) => {
              if (activeTab !== "all" && activeTab !== team.id) return;

              return <TeamSection key={idx} team={team} />;
            })}
          </div>
        </div>
      ) : (
        <Typography
          variant="paragraph2"
          className="font-semibold p-5"
          text="Loading..."
        />
      )}
    </>
  );
};

export default UpdateNotificationPreference;
