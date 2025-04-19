import React from "react";
import Typography from "@/app/(dashboard)/_components/Typography";
import { Users, X } from "lucide-react";
import { CustomTeam } from "@/store/team";
import Image from "next/image";

const Tabs: React.FC<{
  activeTab: string;
  onTabChange: (tab: string) => void;
  teams: CustomTeam[];
}> = ({ activeTab, onTabChange, teams }) => {
  return (
    <div className="flex gap-5 bg-[white] border-b border-[#F2F4F7] pb-4">
      <button
        key={"all"}
        onClick={() => onTabChange("all")}
        className={`flex items-center px-[14px] py-[10px] rounded-lg
            ${
              activeTab === "all"
                ? "bg-[#FAFF7D] border border-[#FAFF7D] shadow-[0px_1px_2px_0px_#1018280D] text-[#2F1847] "
                : "bg-white border border-[#D0D5DD] shadow-[0px_1px_2px_0px_#1018280D] text-[#667085]"
            }`}
        style={{
          opacity: activeTab === "all" ? "1" : "0.8",
        }}
      >
        {/* Icon and Label */}
        <div className="flex items-center gap-2">
          {/* <span>{}</span> */}
          <Users size={20} />
          <Typography
            text={"All team"}
            variant="paragraph3"
            className="font-semibold text-[14px] leading-[22.96px] whitespace-nowrap"
          />
        </div>

        {/* Close Button */}
        {activeTab === "all" && (
          <div
            className="flex items-center justify-center text-[#667085]"
            onClick={() => onTabChange("all")} // Reset to no active tab
            style={{
              marginLeft: "auto", // Push the "X" icon to the right
              padding: 0,
              lineHeight: 0,
            }}
          >
            <X className="w-5 h-5" /> {/* Close Icon */}
          </div>
        )}
      </button>
      {teams?.map((team) => (
        <button
          key={team.id}
          onClick={() => onTabChange(team.id)}
          className={`flex items-center px-[14px] py-[10px] rounded-lg min-w-fit
            ${
              activeTab === team.id
                ? "bg-[#FAFF7D] border border-[#FAFF7D] shadow-[0px_1px_2px_0px_#1018280D] text-[#2F1847] "
                : "bg-white border border-[#D0D5DD] shadow-[0px_1px_2px_0px_#1018280D] text-[#667085]"
            }`}
          style={{
            opacity: activeTab === team.id ? "1" : "0.8",
          }}
        >
          {/* Icon and Label */}
          <div className="flex items-center gap-2">
            {/* <span>{}</span> */}
            <Image src={team.logo || '/fav-icon.svg'} width={20} height={20} alt="logo" />
            <Typography
              text={team.name}
              variant="paragraph3"
              className="font-semibold text-[14px] leading-[22.96px] whitespace-nowrap"
            />
          </div>

          {/* Close Button */}
          {activeTab === team.id && (
            <div
              className="flex items-center justify-center text-[#667085]"
              onClick={() => onTabChange("")} // Reset to no active tab
              style={{
                marginLeft: "auto", // Push the "X" icon to the right
                padding: 0,
                lineHeight: 0,
              }}
            >
              <X className="w-5 h-5" /> {/* Close Icon */}
            </div>
          )}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
