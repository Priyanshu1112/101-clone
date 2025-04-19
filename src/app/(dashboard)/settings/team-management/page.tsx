import React from "react";
// import NoTeam from "./_components/NoTeam";
import TeamList from "./_components/TeamList";

const TeamManagementPage: React.FC = () => {
  return (
    <div
      className="bg-white rounded-lg border border-[#D0D5DD] "
      style={{
        boxShadow: "0px 4px 6px -2px #10182805, 0px 12px 16px -4px #1018280A",
      }}
    >
      {/* <div className="flex justify-center items-center  px-12 pb-12">
        <NoTeam />
      </div> */}
      <TeamList />
    </div>
  );
};

export default TeamManagementPage;
