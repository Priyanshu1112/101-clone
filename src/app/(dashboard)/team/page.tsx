"use client";
import useTeamStore from "@/store/team";
import NoTeam from "./_components/NoTeam";

import AllTeams from "./_components/AllTeams";

const Team = () => {
  const { teams } = useTeamStore();

  return (
    <div className="w-full text-center flex justify-center">
      {(teams?.length ?? 0) > 0 ? <AllTeams /> : <NoTeam />}
    </div>
  );
};

export default Team;
