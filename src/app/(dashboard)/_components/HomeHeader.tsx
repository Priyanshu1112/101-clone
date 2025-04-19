"use client";
import React from "react";
import Typography from "@/app/(dashboard)/_components/Typography";
import UsersIcon from "@/assets/users"; // Ensure this path is correct
import useUserStore from "@/store/user";
import Link from "next/link";

const HomeHeader = () => {
  const { user } = useUserStore();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 16) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <header className="flex justify-between items-start mb-8">
      {/* Left Section: Greeting and Info */}
      <div className="w-[70%]">
        <Typography
          variant="display3"
          text={`${getGreeting()}, ${user?.name ?? ""} 👋`}
          className="font-[Mulish] font-bold text-[#344054] leading-[51.2px] text-left whitespace-nowrap"
        />
        <Typography
          variant="paragraph1"
          text="We've put together this quick start guide to help you get the most out of 101. You can come back to this list anytime by clicking the Home tab from the top."
          className="font-[Mulish] font-semibold text-[#667085] text-[18px] leading-[27px] text-left mt-2"
        />
      </div>

      {/* Right Section: Invite Team Button */}
      <div className="mt-1">
        {user?.role == "Administrator" && (
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
        )}
      </div>
    </header>
  );
};

export default HomeHeader;
