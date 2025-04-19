"use client";
import React, { useState } from "react";
import Typography from "@/app/(dashboard)/_components/Typography";
import TeamCard from "./TeamCard";
import SearchBar from "./SearchBar";
import UsersIcon from "@assets/users";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import useTeamStore from "@/store/team";
import { Role } from "@prisma/client";
import useAppStore from "@/store/app";
import CreateManageTeam from "./CreateManageTeam";
import Link from "next/link";
import { FetchStatus } from "@/store/leave";
import Loader from "@/app/(dashboard)/_components/Loader";
const TeamList: React.FC = () => {
  const { teams, fetchTeam } = useTeamStore();
  const { allUsers } = useAppStore();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#F2F4F7] gap-2">
        <SearchBar
          search={search}
          setSearch={setSearch}
          // Dynamically adjust the width of the search bar
        />
        <div className="flex items-center gap-4">
          <Link
            href={"/onboarding/team-invite"}
            className="px-6 py-3 bg-[#3D4630] rounded-lg flex items-center gap-2 border border-[#7E8475] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]"
          >
            <Typography
              variant="paragraph3"
              text="Invite team"
              className="font-semibold text-[#FAFF7D]"
            />
            <UsersIcon size={18} color="#FAFF7D" />
          </Link>
          <Sheet open={open} onOpenChange={(value) => setOpen(value)}>
            <SheetTrigger className="px-6 py-3 bg-[#FAFF7D] text-[#344054] rounded-lg flex items-center gap-2 shadow-sm">
              <Typography
                variant="paragraph3"
                text="Create new team"
                className="font-semibold text-[#344054]"
              />
              <UsersIcon size={18} color="#344054" />
            </SheetTrigger>
            <SheetContent className="p-0 min-w-[500px] flex flex-col overflow-y-auto overflow-x-hidden">
              <CreateManageTeam isCreate={true} setOpen={setOpen} />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Teams List */}
      <div className="space-y-8 pt-4 ">
        {fetchTeam == FetchStatus.SUCCESS ? (
          teams
            ?.filter((team) =>
              team.name.toLowerCase().includes(search.toLowerCase())
            )
            .map((team, index) => {
              const leads = team?.members?.filter(
                (member) => member.role == Role.Lead
              );

              return (
                <TeamCard
                  index={index}
                  key={index}
                  name={team.name}
                  members={team?.members ?? []}
                  icon={team.logo}
                  leads={leads ?? []}
                  allUsers={allUsers ?? []}
                />
              );
            })
        ) : (
          <div className="py-28">
            <Loader />
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamList;
