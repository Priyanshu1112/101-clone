"use client";
import React, { useState } from "react";
import { Search, CircleUser, CirclePlus, UsersIcon } from "lucide-react";
import Typography from "../Typography";
import UserPlus from "@/assets/UserPlus";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Button from "../Button";
import CreateTeam from "../../team/_components/CreateTeam";
import ManageTeam from "../../team/_components/ManageTeam";
import TeamBox from "../../team/_components/TeamBox";
import Link from "next/link";
import useUserStore from "@/store/user";

const BottomNavTeam = () => {
  const [createTeam, setCreateTeam] = useState<boolean>(false);

  const { user } = useUserStore();

  return (
    <div className="py-4 px-20 flex justify-between">
      <span
        className="flex items-center gap-2 px-3 py-2 bg-secondary-300 border border-secondary-200 rounded-[8px] cursor-pointer"
        style={{ boxShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)" }}
      >
        <input
          placeholder="Search members"
          className="bg-transparent active:border-none focus:outline-none text-white w-[441px] placeholder:text-white placeholder:opacity-70"
        />{" "}
        <Search size={16} color={"white"} />
      </span>
      {/* Actions */}
      {user?.role == "Administrator" && (
        <span className="flex gap-4">
          <Link
            href={"/onboarding/team-invite"}
            className="px-[14px] py-[10px] rounded-[8px] border border-brand/main text-brand/main flex gap-[6px]"
          >
            <Typography
              variant="paragraph3"
              text="Invite member"
              className="font-semibold"
            />{" "}
            <UserPlus size={20} />{" "}
          </Link>
          <Sheet>
            <SheetTrigger className="px-[14px] py-[10px] rounded-[8px] border border-brand/main bg-brand/main flex gap-[6px] text-dark">
              {" "}
              <Typography
                variant="paragraph3"
                text="Manage teams/members"
                className="font-semibold"
              />{" "}
              <CircleUser size={20} />{" "}
            </SheetTrigger>
            <SheetContent className="min-w-[1220px] p-0 bg-grey-100 overflow-auto">
              <SheetTitle className="px-6 py-4 border-b border-grey-300 flex items-center justify-between sticky top-0 z-10 bg-white">
                <Typography variant="display4" text={"Manage teams/members"} className="" />

                <div className="flex gap-2">
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
                  <Button
                    text={"Create new team"}
                    className={"bg-brand/main text-dark mr-12"}
                    icon={CirclePlus}
                    onClick={() => {
                      setCreateTeam(true);
                    }}
                  />
                </div>
              </SheetTitle>
              <div className="flex w-full px-6 py-10 gap-[94px]">
                <TeamBox setCreateTeam={setCreateTeam} />
                {createTeam ? (
                  <CreateTeam setCreateTeam={setCreateTeam} />
                ) : (
                  <ManageTeam />
                )}
              </div>
            </SheetContent>
          </Sheet>
        </span>
      )}
    </div>
  );
};

export default BottomNavTeam;
