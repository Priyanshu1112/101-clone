"use client";
import React, { useMemo } from "react";
import useTeamStore from "@/store/team";
import Image from "next/image";
import Typography from "../../_components/Typography";
import { UserCircleBg } from "@/assets/UserCircle";
import { calendarCodes } from "@/utils/constant/calendarCodes";
import { Role, UpdateResponse } from "@prisma/client";
import Star3 from "@/assets/Star3";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Archive, MoreVertical, Star, UserCircle } from "lucide-react";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
import useAppStore from "@/store/app";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { toastFullfilled, toastPending } from "../../_components/Toast";
dayjs.extend(relativeTime);

const AllTeams = () => {
  const router = useRouter();

  const { currentTeam, teams, archiveUser } = useTeamStore();

  const { setActiveUser } = useAppStore();

  const orderedTeams = useMemo(() => {
    if (!currentTeam || !teams) return teams;
    return [currentTeam, ...teams.filter((team) => team.id !== currentTeam.id)];
  }, [currentTeam, teams]);

  const archivedUsers = useMemo(() => {
    const archivedList: {
      id: string;
      teamName: string;
      name: string;
      email: string;
    }[] = [];

    // Collect archived users
    orderedTeams?.forEach((team) => {
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
  }, [orderedTeams]);

  const getUpdateFrequency = (response: UpdateResponse[]) => {
    const { complete, incomplete } = response.reduce(
      (acc, data) => {
        if (data.status == "Complete")
          return { ...acc, complete: acc.complete + 1 };
        else if (data.status == "Incomplete")
          return { ...acc, incomplete: acc.incomplete + 1 };

        return acc;
      },
      { complete: 0, incomplete: 0 }
    );

    return complete + incomplete != 0
      ? (complete * 100) / (complete + incomplete)
      : 0;
  };

  return (
    <div className="w-full flex gap-[70px]">
      <div className="flex flex-col gap-9">
        {orderedTeams?.map((team) => {
          const teamLead = team.members.find(
            (member) => member.role == Role.Lead
          );
          return (
            // Use team-container-{id} format for the ID to match TeamBox's handleTeamClick function
            <div key={team.id} id={`team-container-${team.id}`}>
              <div className="flex gap-3 items-center">
                <Image
                  src={team.logo || "/fav-icon.svg"}
                  width={20}
                  height={20}
                  alt="team-logo"
                />
                <Typography
                  text={team.name}
                  className="font-bold text-grey/400"
                  variant="paragraph1"
                />
              </div>
              <div className="mt-5 rounded-[9px] border border-grey-300">
                {team.members.map((member) => {
                  if (member.isArchive) {
                    return null; // Skip archived members here
                  }
                  return (
                    <div
                      key={member.id}
                      className="grid grid-cols-[2fr_1fr_1fr_1fr] border-b last:border-b-0 p-4 border-grey-300 gap-8"
                    >
                      <span className="flex gap-2">
                        <div className="min-h-9 min-w-9">
                          <UserCircleBg
                            code={calendarCodes[member.colorCode]}
                          />
                        </div>
                        <span>
                          <span className="flex gap-1">
                            <Typography
                              className="font-semibold text-grey/500 text-start capitalize"
                              text={member.name}
                              variant="paragraph3"
                            />
                            {member.role == Role.Lead && <Star3 />}
                          </span>
                          <Typography
                            text={member.email}
                            className="font-semibold text-grey/400"
                            variant="label"
                          />
                        </span>
                      </span>

                      <Field
                        label="Approver"
                        value={
                          member.approver
                            ? member.approver.name
                            : teamLead?.name ?? ""
                        }
                      />
                      <Field
                        label="Last leave taken"
                        value={
                          member.leaveRecord.length > 0
                            ? `${dayjs(member.leaveRecord[0].start).format(
                                "MMM D, YYYY"
                              )} (${dayjs(
                                member.leaveRecord[0].start
                              ).fromNow()})`
                            : null
                        }
                        none={member.leaveRecord.length == 0}
                      />
                      <span className="flex gap-[70px]">
                        <Field
                          label="Updates frequecy"
                          value={
                            Math.ceil(
                              getUpdateFrequency(member.updateResponse ?? [])
                            ).toString() + "% on time updates"
                          }
                          className="lowercase whitespace-nowrap w-[20ch]"
                        />
                        <DropdownMenu>
                          <DropdownMenuTrigger className="text-grey/500">
                            <MoreVertical size={24} />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              className="py-[10px] px-4 flex items-center gap-2 text-grey/500"
                              onClick={() => {
                                setActiveUser(member.id);
                                router.push("/profile/" + member.id);
                              }}
                            >
                              <UserCircle size={16} />
                              <Typography
                                text="View Profile"
                                variant="paragraph3"
                              />
                            </DropdownMenuItem>
                            {member.role == Role.Lead && (
                              <DropdownMenuItem className="py-[10px] px-4 flex items-center gap-2 text-grey/500">
                                <Star size={16} />
                                <Typography
                                  text="Remove as admin"
                                  variant="paragraph3"
                                />
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              className="py-[10px] px-4 flex items-center gap-2 text-error-300 focus:text-error-500"
                              onClick={async () => {
                                const toastId = toastPending(
                                  "Archiving member..."
                                );
                                const res = await archiveUser(
                                  member.id,
                                  team.id
                                );

                                toastFullfilled(
                                  toastId,
                                  res,
                                  "Member archived successfully!",
                                  "Error archiving member"
                                );
                              }}
                            >
                              <Archive size={16} />
                              <Typography
                                text="Archive user"
                                variant="paragraph3"
                              />
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        <div className="flex flex-col" id="team-container-archived">
          <div className="flex gap-3 items-center">
            <Archive size={20} color="#667085" />
            <Typography
              text="ARCHIVED MEMBERS"
              className="font-bold text-grey/400"
              variant="paragraph1"
            />
          </div>

          <div className="mt-5 rounded-[9px] border border-grey-300">
            {archivedUsers.length > 0 ? (
              archivedUsers.map((data) => {
                return (
                  <div
                    key={data.id + data.teamName}
                    className="grid grid-cols-5 border-b last:border-b-0 p-4 border-grey-300 gap-8"
                  >
                    <span className="flex gap-2">
                      <UserCircleBg code={{ bg: "#D6F4FF", text: "#667085" }} />
                      <span>
                        <span className="flex gap-1">
                          <Typography
                            className="font-semibold text-grey/500 text-start capitalize"
                            text={data.name}
                            variant="paragraph3"
                          />
                        </span>
                        <Typography
                          text={data.email}
                          className="font-semibold text-grey/400"
                          variant="label"
                        />
                      </span>
                    </span>
                    <Field label="Team" value={data.teamName} />
                    <Field label="Leaving date" value={"how to get this"} />
                  </div>
                );
              })
            ) : (
              <Typography
                text="No archived users!"
                variant="paragraph1"
                className="font-bold text-grey/400 w-full text-center"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Field = ({
  label,
  value,
  none,
  className,
}: {
  label: string;
  value?: string | null;
  none?: boolean;
  className?: string;
}) => {
  return (
    <>
      <span>
        <Typography
          text={label}
          variant="label"
          className="font-semibold text-grey/400 text-start"
        />
        {value && (
          <Typography
            className={cn(
              "font-semibold text-grey/500 text-start capitalize",
              className
            )}
            text={value}
            variant="paragraph3"
          />
        )}
        {none && (
          <Typography
            text="No leave"
            variant="paragraph3"
            className="text-grey/400 italic text-start font-semibold"
          />
        )}
      </span>
    </>
  );
};

export default AllTeams;