import Avatar from "./Avatar";
import ProfileDetails from "./ProfileDetails";
import EditProfileButton from "./EditProfileButton";
import { useMemo } from "react";
import dayjs from "dayjs";
import useTeamStore from "@/store/team";
import useAppStore from "@/store/app";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

const LeftPanel = () => {
  const { teamUser, teams: allTeam } = useTeamStore();
  const { activeUser } = useAppStore();

  const details = useMemo(() => {
    return [
      {
        label: "Birth Date",
        value: dayjs(activeUser?.birthday, "DD/MM/YYYY").isValid()
          ? dayjs(activeUser?.birthday, "DD/MM/YYYY").format("MMM D, YYYY")
          : "Not Added",
      },
      {
        label: "Work Anniversary",
        value: dayjs(activeUser?.workAnniversary, "DD/MM/YYYY").isValid()
          ? dayjs(activeUser?.workAnniversary, "DD/MM/YYYY").format(
              "MMM D, YYYY"
            )
          : "Not Added",
      },

      {
        label: "Working Days",
        value: `${
          activeUser?.teamUsers?.[0].team.workDay?.[0]?.workWeek ?? "Not added"
        }`,
      },
    ];
  }, [activeUser]);

  // const approver = useMemo(() => {
  //   return teamUser?.find((data) => {
  //     if (
  //       data.teamId === (teams?.[0]?.teamId ?? "") &&
  //       data.role == Role.Lead
  //     ) {
  //       return data.user;
  //     }
  //   });
  // }, [teamUser, teams]);

  const getTeamName = () => {
    // if (self == "false") {
    const teamIds = teamUser
      ?.filter((team) => team.userId == activeUser?.id)
      .map((data) => data.teamId);

    return (
      allTeam
        ?.filter((team) => teamIds?.includes(team.id))
        .map((data) => data.name) ?? []
    );
    // } else {
    //   return (
    //     teams
    //       ?.map((team) => team.team.name)
    //       .sort((a, b) => a.localeCompare(b)) ?? []
    //   ); // Sort strings alphabetically
    // }
  };

  return (
    <div className="w-1/3 bg-[#F9FAFB] border border-[#D0D5DD] rounded-lg flex flex-col justify-between">
      <div className="space-y-4 p-6">
        <Avatar
          name={activeUser?.name ?? ""}
          email={activeUser?.email ?? ""}
          approver={activeUser?.approver?.name ?? ""}
          team={getTeamName()}
        />
        <ProfileDetails details={details} />
      </div>
      <div className="p-6">
        <EditProfileButton />
      </div>
    </div>
  );
};

export default LeftPanel;
