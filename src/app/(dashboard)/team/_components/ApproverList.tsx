"use client";
import React, { useMemo, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Typography from "../../_components/Typography";
import useTeamStore, { CustomTeamUser } from "@/store/team";
import { Input, Type } from "../../_components/Input";
import { ChevronDown, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Role } from "@prisma/client";

const ApproverList = ({
  teamLeads,
  isTeamApprover = true,
  data: tuData,
}: {
  teamLeads: CustomTeamUser[];
  isTeamApprover?: boolean;
  data?: CustomTeamUser;
}) => {
  const { teamUser, currentTeam, changeTeamApprover, changeUserApprover } =
    useTeamStore();
  const [search, setSearch] = useState("");

  const teamApprover = useMemo(() => {
    return (teamLeads?.length ?? 0) > 1
      ? "Multiple"
      : teamLeads?.[0]?.user?.name ?? "";
  }, [teamLeads]);

  const getTeamLead = () => {
    return teamLeads.find((data) => data.role == Role.Lead)?.user?.name;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex  items-center gap-1">
        {isTeamApprover ? (
          <Typography
            text={teamApprover}
            variant="paragraph2"
            className="font-semibold capitalize"
          />
        ) : (
          <Typography
            variant="paragraph3"
            text={
              tuData?.user?.approver
                ? tuData.user.approver.name ?? ""
                : teamApprover == "Multiple"
                ? getTeamLead()
                : teamApprover
            }
            className="text-grey/500 font-semibold truncate"
          />
        )}
        <ChevronDown
          size={isTeamApprover ? 20 : 16}
          className={cn(isTeamApprover ? "text-grey/500" : "text-grey/350")}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={isTeamApprover ? "end" : "center"}
        className="max-w-60"
      >
        <div className="p-2">
          <Input
            placeholder="Search member"
            type={Type.Search}
            containerClass="w-full py-2"
            value={search}
            setValue={setSearch}
          />
        </div>
        <DropdownMenuRadioGroup>
          {teamUser
            ?.filter(
              (data) =>
                data.teamId == currentTeam?.id &&
                (data.user?.name.includes(search) ||
                  data.user?.email.includes(search))
            )
            .map((data) => {
              return (
                <DropdownMenuRadioItem
                  key={data.userId}
                  value={data.userId}
                  className="flex gap-2 items-start pl-2"
                  onClick={() => {
                    if (isTeamApprover)
                      changeTeamApprover(data.teamId, data.userId);
                    else changeUserApprover(tuData?.userId ?? "", data.userId);
                  }}
                >
                  <span className="py-1 text-grey/400">
                    <Circle size={16} />
                  </span>
                  <span>
                    <Typography
                      text={data.user?.name ?? ""}
                      variant="paragraph3"
                      className="font-bold text-grey/500 capitalize"
                    />
                    <Typography
                      text={data.user?.email ?? ""}
                      variant="paragraph3"
                      className="font-semibold text-grey/400"
                    />
                  </span>
                </DropdownMenuRadioItem>
              );
            })}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ApproverList;
