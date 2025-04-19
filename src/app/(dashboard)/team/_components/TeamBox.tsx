import useTeamStore from "@/store/team";
import TeamLogo from "./TeamLogo";
import Typography from "../../_components/Typography";
import { Archive, CirclePlus } from "lucide-react";
import { Dispatch, SetStateAction, useMemo } from "react";
import useUserStore from "@/store/user";
import Loader from "../../_components/Loader";

const TeamBox = ({
  setCreateTeam,
  isAllTeams = false,
}: {
  setCreateTeam?: Dispatch<SetStateAction<boolean>>;
  isAllTeams?: boolean;
}) => {
  const { teams } = useTeamStore();
  const { user } = useUserStore();

  const archivedUsers = useMemo(() => {
    const archivedList: {
      id: string;
      teamName: string;
      name: string;
      email: string;
    }[] = [];

    // Collect archived users
    teams?.forEach((team) => {
      team.members.forEach((member) => {
        if (member.isArchive) {
          archivedList.push({
            id: member.id,
            teamName: team.name,
            name: member.name,
            email: member.email,
          });
        }
      });
    });

    return archivedList;
  }, [teams]);

  // Scroll to the team container with the matching id
  const handleTeamClick = (teamId: string) => {
    const teamElement = document.getElementById(`team-container-${teamId}`);
    console.log("Scrolling to:", teamElement, teamId);
    if (teamElement) {
      teamElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Handle click on archived members section
  const handleArchivedClick = () => {
    const archivedElement = document.getElementById("team-container-archived");
    console.log("Scrolling to archived section:", archivedElement);
    if (archivedElement) {
      archivedElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <span>
      <div className="min-w-[312px] sticky top-0 rounded-[9px] border border-grey-300 bg-grey-100">
        {teams ? (
          teams.length > 0 ? (
            <>
              {teams.map((team, index) => {
                return (
                  <div
                    key={index}
                    onClick={() => handleTeamClick(team.id)}
                    className="p-4 flex justify-between border-b border-grey-300 last:border-none cursor-pointer hover:bg-grey-200"
                  >
                    <span className="flex items-center gap-3">
                      <TeamLogo src={team.logo || "/fav-icon.svg"} />
                      <Typography variant="paragraph2" text={team.name} />
                    </span>
                    <Typography
                      variant="paragraph2"
                      text={`${team.members?.length ?? 0} members`}
                    />
                  </div>
                );
              })}
              {isAllTeams && (
                <div
                  key={teams.length}
                  onClick={handleArchivedClick}
                  className="p-4 flex justify-between border-b border-grey-300 last:border-none text-grey/400 cursor-pointer hover:bg-grey-200"
                >
                  <span className="flex items-center gap-3">
                    <Archive size={20} />
                    <Typography variant="paragraph2" text="Archived members" />
                  </span>
                  <Typography
                    variant="paragraph2"
                    text={`${archivedUsers.length ?? 0} members`}
                  />
                </div>
              )}
            </>
          ) : (
            <Typography
              variant="paragraph2"
              className="text-grey/500 font-semibold p-5"
              text="No Teams"
            />
          )
        ) : (
          <div className="py-20">
            <Loader />
          </div>
        )}
      </div>
      {!isAllTeams && user?.role === "Administrator" && (
        <button
          className="flex gap-3 items-center p-4 hover:text-grey-600"
          onClick={() => {
            if (setCreateTeam) setCreateTeam(true);
          }}
        >
          <CirclePlus size={20} />
          <Typography variant="paragraph2" text="Create new team" />
        </button>
      )}
    </span>
  );
};

export default TeamBox;
