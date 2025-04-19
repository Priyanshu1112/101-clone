"use client";
import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordian";
import Typography from "@/app/(dashboard)/_components/Typography";
import { ChevronDown, MoreVertical, Settings } from "lucide-react";
import { UserCircleBg } from "@assets/UserCircle";
import useTeamStore, { CustomMember } from "@/store/team";
import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";
import { calendarCodes } from "@/utils/constant/calendarCodes";
import {
  DropdownMenu,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import {
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Input, Type } from "@/app/(dashboard)/_components/Input";
import useAppStore from "@/store/app";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import CreateManageTeam from "./CreateManageTeam";

interface AllUsers {
  id: string;
  name: string;
  email: string;
}

interface TeamCardProps {
  name: string;
  members: CustomMember[];
  icon: string;
  leads: CustomMember[];
  allUsers: AllUsers[];
  index: number;
}

const TeamCard: React.FC<TeamCardProps> = ({
  index,
  name,
  members,
  icon,
  leads,
  allUsers,
}) => {
  const [open, setOpen] = useState(false);
  const { setCurrentTeamIndex } = useTeamStore();

  return (
    <Accordion type="multiple">
      <AccordionItem value={name}>
        <div className="border rounded-lg shadow-lg">
          {/* Team Header */}
          <AccordionTrigger
            className="p-4 flex items-center justify-between"
            onClick={(e) => {
              if ((e.target as HTMLElement).closest(".manage-team-trigger")) {
                e.preventDefault();
                e.stopPropagation();
                return false;
              }
            }}
          >
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 flex items-start justify-center rounded-full">
                <Image
                  src={icon || "/fav-icon.svg"}
                  width={18}
                  height={18}
                  alt="team-logo"
                />
              </div>
              <div>
                <Typography
                  variant="paragraph1"
                  text={name}
                  className="font-bold text-[#344054] text-[18px] leading-[28.8px] font-[Mulish] text-left"
                />
                <Typography
                  variant="paragraph3"
                  text={`${members.length ?? 0} Members`}
                  className="font-semibold text-[#667085] text-[14px] leading-[22.96px] font-[Mulish] text-left"
                />
              </div>
            </div>
            <div className="flex gap-3 ml-auto">
              <div
                role="banner"
                className="px-4 py-2 bg-white rounded-lg"
                style={{
                  boxShadow: "0px 1px 2px 0px #1018280D",
                }}
              >
                <Typography
                  variant="paragraph3"
                  text="Change Approver"
                  className="text-[#D0D5DD] font-semibold text-[14px] leading-[22.96px] text-left"
                />
              </div>

              <Sheet open={open} onOpenChange={(value) => setOpen(value)}>
                <SheetTrigger
                  asChild
                  className="px-4 py-2 bg-[#3D4630] rounded-lg manage-team-trigger"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentTeamIndex(index);
                  }}
                >
                  <Typography
                    variant="paragraph3"
                    text="Manage Team"
                    className="text-[#FAFF7D] font-semibold"
                  />
                </SheetTrigger>
                <SheetContent className="p-0 min-w-[500px] flex flex-col overflow-y-auto overflow-x-hidden">
                  <CreateManageTeam isCreate={false} setOpen={setOpen} />
                </SheetContent>
              </Sheet>
            </div>
          </AccordionTrigger>

          {/* Team Members */}
          <AccordionContent>
            <div>
              {/* Table Header */}
              <div className="grid grid-cols-12 bg-[#F2F4F7] border-b border p-4">
                <div className="col-span-5 flex items-center gap-3">
                  <Checkbox className="size-4" />

                  <div className="col-span-4">
                    <Typography
                      variant="paragraph3"
                      text="Name"
                      className="text-[#667085] font-semibold text-[14px] leading-[22.96px] font-[Mulish] text-left"
                    />
                  </div>
                </div>
                <div className="col-span-4">
                  <Typography
                    variant="paragraph3"
                    text="Approver"
                    className="text-[#667085] font-semibold text-[14px] leading-[22.96px] font-[Mulish] text-left"
                  />
                </div>
                <div className="col-span-3">
                  <Typography
                    variant="paragraph3"
                    text="Team"
                    className="text-[#667085] font-semibold text-[14px] leading-[22.96px] font-[Mulish] text-left"
                  />
                </div>
              </div>
              {/* Team Member Rows */}
              {members
                .slice()
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((member, index) => {
                  const isLead = leads.includes(member);

                  return (
                    <MemberRow
                      key={index}
                      allUsers={allUsers}
                      isLead={isLead}
                      leads={leads}
                      member={member}
                      name={name}
                    />
                  );
                })}
            </div>
          </AccordionContent>
        </div>
      </AccordionItem>
    </Accordion>
  );
};

const MemberRow = ({
  member,
  leads,
  allUsers,
  isLead,
  name,
}: {
  member: CustomMember;
  leads: CustomMember[];
  allUsers: AllUsers[];
  isLead: boolean;
  name: string;
}) => {
  const [approver, setApprover] = useState(
    (member.approver && member.approver.id) ?? (leads.length > 0 && leads[0].id)
  );
  const [search, setSearch] = useState("");

  const { updateApprover } = useAppStore();

  useEffect(() => {
    updateApprover(member.id ?? "", approver);
  }, [approver, member, updateApprover]);

  return (
    <div className="grid grid-cols-12 items-center border-[#EAECF0] p-4">
      <div className="col-span-5 flex items-center gap-3">
        <Checkbox className="size-4" />

        <div className="col-span-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center rounded-full">
              <UserCircleBg code={calendarCodes[member.colorCode]} />
            </div>
            <div>
              <Typography
                variant="paragraph3"
                text={member.name}
                className="font-semibold capitalize"
              />
              <Typography
                variant="label"
                text={member.email}
                className="font-semibold text-[#667085] text-sm"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex gap-2 items-center">
            <Typography
              variant="paragraph3"
              text={allUsers.find((user) => user.id == approver)?.name}
              className="text-[#344054] font-semibold text-[14px] capitalize leading-[22.96px] font-[Mulish] text-right"
            />
            <ChevronDown size={16} className="text-grey/350" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="p-2  border border-grey-200 shadow-sm bg-white rounded max-h-[30vh] overflow-auto no-scrollbar relative">
            <div className="p-2">
              <Input
                placeholder="Search member"
                type={Type.Search}
                containerClass="w-full"
                value={search}
                setValue={setSearch}
              />
            </div>
            <DropdownMenuRadioGroup
              className="mt-1 px-[6px] py-1"
              value={approver}
              onValueChange={setApprover}
            >
              {allUsers
                .filter(
                  (user) =>
                    user.name.includes(search) || user.email.includes(search)
                )
                .map((user) => (
                  <DropdownMenuRadioItem key={user.id} value={user.id}>
                    <div className="flex  flex-col">
                      <Typography
                        text={user.name}
                        variant="paragraph3"
                        className="font-bold text-grey/500 capitalize"
                      />
                      <Typography
                        text={user.email}
                        variant="paragraph3"
                        className="font-semibold text-grey/400"
                      />
                    </div>
                  </DropdownMenuRadioItem>
                ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="col-span-3 flex items-center justify-between">
        <div className="hover:underline">
          <Typography
            variant="paragraph3"
            text={name}
            className="text-[#344054] font-semibold text-[14px] leading-[22.96px] font-[Mulish] text-right"
          />
        </div>
        <div className="flex items-center gap-2 ml-auto">
          {/* {member.isAdmin && ( */}
          {isLead && <Settings size={16} className="text-[#3D4630]" />}
          <MoreVertical size={16} className="text-[#667085]" />
        </div>
      </div>
    </div>
  );
};

export default TeamCard;
