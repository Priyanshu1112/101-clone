import NoTeamsBg from "@/assets/NoTeamsBg";
import { CircleUser } from "lucide-react";
import React from "react";
import Typography from "../../../_components/Typography";
import UsersIcon from "@/assets/users";
import Link from "next/link";
import useUserStore from "@/store/user";
const NoTeam = () => {
  const { user } = useUserStore();

  return (
    <span className="  relative">
      <NoTeamsBg />
      <div
        className="p-8 rounded-[200px] inline-block absolute top-[188px] left-[188px]"
        style={{
          background: "linear-gradient(180deg, #F9FAFB 0%, #EAECF0 100%)",
        }}
      >
        <CircleUser size={48} color={"#979FAF"} />
      </div>
      <div className="w-[352px] flex flex-col items-center absolute top-[348px] left-16">
        <Typography
          variant="display4"
          text="Create your first team"
          className="font-semibold text-[#2F1847]"
        />
        <Typography
          variant="paragraph2"
          text="Work is best when your team is around. Invite your team members."
          className="font-semibold text-center text-[#667085] mt-2 mb-6"
        />
        {user?.role == "Administrator" && (
          <Link
            href={"/api/onboarding/team-invite"}
            className="px-[14px] py-[10px] flex gap-[6px] bg-[#FAFF7D] border border-[#FAFF7D] rounded-[8px] text-secondary-100"
          >
            {" "}
            <Typography
              variant="paragraph3"
              text="Invite team member"
              className="font-semibold text-[#2F1847] "
            />{" "}
            <UsersIcon size={20} />{" "}
          </Link>
        )}
      </div>
    </span>
  );
};

export default NoTeam;
