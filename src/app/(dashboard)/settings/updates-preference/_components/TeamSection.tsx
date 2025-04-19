"use client";
import React, { useMemo, useState } from "react";
import Typography from "@/app/(dashboard)/_components/Typography";
import { CustomTeam } from "@/store/team";
import Image from "next/image";
import AddNext from "../../_components/AddNext";
import AddEditUpdates from "./AddEditUpdates";
import useUpdateStore from "@/store/update";
import dayjs from "dayjs";
import useAppStore from "@/store/app";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface TeamSectionProps {
  team: CustomTeam;
}

const TeamSection: React.FC<TeamSectionProps> = ({ team }) => {
  const { updates } = useUpdateStore();
  const { channels } = useAppStore();

  const getChannelName = (channelId: string) => {
    return channels?.find((channel) => channel.id == channelId)?.name;
  };

  const teamUpdate = useMemo(() => {
    return updates?.filter((update) => update?.teamId == team?.id);
  }, [updates, team]);

  return (
    <div className="p-6 border border-[#EAECF0] rounded-lg shadow-[0px_1px_2px_0px_#1018280D]">
      {/* Team Header */}
      <div className="flex justify-between items-center mb-6 border-b border-[#EAECF0] pb-4">
        <div className="flex items-center gap-3">
          {/* Team Icon */}
          <div className="w-8 h-8 flex items-center justify-center rounded-full">
            <Image
              src={team.logo || "/fav-icon.svg"}
              width={20}
              height={20}
              alt="logo"
            />
          </div>
          <Typography
            text={team.name ?? ""}
            variant="paragraph1"
            className="font-semibold text-[#344054]"
          />
        </div>

        <AddNext>
          <AddEditUpdates isAdd={true} teamId={team.id} />
        </AddNext>
      </div>
      {/* Notifications */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        {(teamUpdate?.length ?? 0) > 0 ? (
          teamUpdate?.map((update, idx) => (
            <div
              key={idx}
              className="p-4 border rounded-lg bg-[#F9FAFB80] border-[#D0D5DD] shadow-[0px_4px_6px_-2px_#10182805]"
            >
              <div className="flex justify-between items-center mb-2">
                <Typography
                  text={dayjs("2023-01-01 " + update.time).format("h:mm A")}
                  variant="heading1"
                  className="font-semibold text-[#2F1847] text-[20px] leading-[32px] font-[Mulish] text-left"
                />
                <Typography
                  className="flex items-center justify-center text-warning/700 py-[2px] px-2 font-semibold rounded-[16px] border border-warning/200 bg-warning/50"
                  variant="label"
                >
                  {update.questions.length ?? 0} que
                </Typography>
              </div>
              <Typography
                text={`${update.members?.length ?? 0} Members • #${
                  getChannelName(update?.channelId) ?? ""
                }`}
                variant="paragraph3"
                className="text-[#667085] text-[14px] leading-[22.96px] font-[Mulish] font-normal text-left mb-2"
              />
              <EditDetails updateId={update.id} teamName={team.name} />
            </div>
          ))
        ) : (
          <Typography
            variant="paragraph2"
            text="No updates!"
            className="text-gray-400 font-semibold text-center w-full col-span-3"
          />
        )}
      </div>
    </div>
  );
};

const EditDetails = ({
  updateId,
  teamName,
}: {
  updateId: string;
  teamName: string;
}) => {
  const [open, setOpen] = useState(false);
  const { setCurrentUpdate } = useUpdateStore();

  return (
    <Sheet
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        if (value) setCurrentUpdate(updateId);
      }}
    >
      <SheetTrigger className="text-dark flex items-center gap-1 py-[10px] rounded-[8px]">
        <Typography
          text="Edit details"
          variant="label"
          className="underline font-semibold"
        />
      </SheetTrigger>
      <SheetContent className="p-0 min-w-[500px] flex flex-col overflow-y-auto overflow-x-hidden">
        <AddEditUpdates isAdd={false} setOpen={setOpen} teamName={teamName} />
      </SheetContent>
    </Sheet>
  );
};

export default TeamSection;
