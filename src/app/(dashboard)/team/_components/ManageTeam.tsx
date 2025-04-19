import useTeamStore from "@/store/team";
import TeamLogo from "./TeamLogo";
import Typography from "../../_components/Typography";
import { UserCircleBg } from "@/assets/UserCircle";
import Star3 from "@/assets/Star3";
import { EllipsisVertical } from "lucide-react";
import { useMemo, useState } from "react";
import { calendarCodes } from "@/utils/constant/calendarCodes";
import { FetchStatus } from "@/store/leave";
import { Role } from "@prisma/client";
import ApproverList from "./ApproverList";

const ManageTeam = () => {
  const { teams, currentTeam, fetchTeam, teamUser } = useTeamStore();
  // const { user } = useUserStore();
  const [teamApprover, setTeamApprover] = useState<string | undefined>();

  console.log(teamApprover);

  // const [approverSelect, setApproverSelect] = useState<boolean>(false);
  // const [teamSelect, setTeamSelect] = useState<boolean>(false);

  const [teamApproverSelect, setTeamApproverSelect] = useState<boolean>(false);

  const teamLeads = useMemo(() => {
    return teamUser?.filter(
      (data) =>
        data.teamId == currentTeam?.id &&
        (data.role == Role.Lead || data.user?.approver)
    );
  }, [currentTeam, teamUser]);
  console.log({ teamLeads, currentTeam });

  if (fetchTeam == FetchStatus.PENDING || !teams)
    return (
      <Typography
        text="Fetching Teams..."
        variant="paragraph2"
        className="text-grey/500 font-semibold"
      />
    );

  if (fetchTeam == FetchStatus.SUCCESS && (!teams || teams.length == 0))
    return (
      <Typography
        text="No Teams"
        variant="paragraph2"
        className="text-grey/500 font-semibold"
      />
    );

  return (
    <div className="w-full overflow-hidden">
      <div className="flex justify-between items-center text-grey/400">
        <span className="flex gap-3 items-center ">
          <TeamLogo src={currentTeam?.logo || "/fav-icon.svg"} />
          <Typography
            variant="paragraph1"
            text={currentTeam?.name ?? ""}
            className="font-bold uppercase"
          />
        </span>
        <span className="flex gap-4 items-center">
          <Typography
            variant="paragraph2"
            text={"Team approver:"}
            className="font-semibold whitespace-nowrap text-grey/500"
          />
          {/* <Select
            open={teamApproverSelect}
            onOpenChange={(value) => setTeamApproverSelect(value)}
            onValueChange={(value) => {
              const user = allUsers?.find((user) => user.id == value);
              if (user) setTeamApprover(user.name);
            }}
          >
            <SelectTrigger className="p-0 border-none focus:ring-0 focus:ring-offset-0 text-grey/500 font-semibold text-base">
              <span
                onClick={(e) => {
                  e.preventDefault();
                  setTeamApproverSelect(true);
                }}
              >
                <Typography
                  // text={teamLeads && (teamLeads?.length ?? 0) > 0 ? 'Multiple' :( teamLeads[0]?.user?.name ?? '')}
                  text={
                    (teamLeads?.length ?? 0) > 1
                      ? "Multiple"
                      : teamLeads?.[0]?.user?.name ?? ""
                  }
                  variant="paragraph2"
                  className="font-semibold capitalize"
                />
              </span>
            </SelectTrigger>
            <SelectContent>
              {teamUser
                ?.filter((data) => data.teamId == currentTeam?.id)
                ?.map((data, index) => (
                  <RadioGroup key={index} defaultValue="option-one">
                    <RadioGroupItem value={data.userId}>
                      {data.user?.name}
                    </RadioGroupItem>
                  </RadioGroup>
                ))}
            </SelectContent>
          </Select> */}
          <ApproverList teamLeads={teamLeads ?? []} />
        </span>
      </div>
      <div className="border border-grey-300 mt-5 rounded-[9px] max-w-full ">
        {teamUser && teamUser.length > 0 ? (
          teamUser.map((data, index) => {
            if (data.teamId != currentTeam?.id) return;

            return (
              <div
                key={index}
                className="p-5 grid grid-cols-[250px_1fr_100px_100px] gap-12"
              >
                <span className="flex gap-2 items-center cursor-pointer">
                  <span>
                    <UserCircleBg
                      code={calendarCodes[data.user?.colorCode ?? 0]}
                    />
                  </span>
                  <span className="flex flex-col truncate">
                    <Typography
                      variant="paragraph3"
                      text={data.user?.name}
                      className="text-grey/500 font-semibold truncate capitalize"
                    />
                    <Typography
                      variant="label"
                      text={data.user?.email}
                      className="text-grey/400 font-semibold truncate"
                    />
                  </span>
                </span>
                <span className="">
                  <Typography
                    variant="label"
                    text={"Approver"}
                    className="text-grey/400 font-semibold truncate"
                  />
                  {/* <Typography
                    variant="paragraph3"
                    text={
                      (teamLeads?.length ?? 0) > 1
                        ? data.user?.approver && data.user.approver.name
                        : teamLeads?.[0]?.user?.name ?? ""
                    }
                    className="text-grey/500 font-semibold truncate"
                  /> */}
                  <ApproverList
                    teamLeads={teamLeads ?? []}
                    isTeamApprover={false}
                    data={data}
                  />
                </span>
                <span>
                  <Typography
                    variant="label"
                    text={"Team"}
                    className="text-grey/400 font-semibold truncate"
                  />
                  <Typography
                    variant="paragraph3"
                    text={currentTeam.name}
                    className="text-grey/500 font-semibold truncate"
                  />
                </span>
                <span className="flex justify-end items-center gap-4">
                  {data.role == Role.Lead && (
                    <span>
                      {" "}
                      <Star3 />
                    </span>
                  )}
                  <EllipsisVertical size={24} />
                </span>
              </div>
            );
          })
        ) : (
          <div className="py-4 px-4 grid grid-cols-4">
            <Typography
              text="No members!"
              variant="paragraph3"
              className="text-grey/500"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageTeam;
