"use client";

import React from "react";
import Typography from "@/app/(dashboard)/_components/Typography";
import { UserRound, Bolt } from "lucide-react";
import useUserStore from "@/store/user";
import { Role } from "@prisma/client";

const ProfileHeader: React.FC = () => {
  const { user, teams } = useUserStore();

  console.log({user, teams})

  return (
    <div className="bg-gray-50 rounded-lg p-6 flex justify-between items-start border border-gray-200">
      {/* Left Section: User Details */}
      <div className="flex items-start gap-6">
        {/* Profile Image */}
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center relative top-1">
          <UserRound className="w-8 h-8 text-blue-500" />
        </div>

        <div>
          {/* User Name, Role Badge, and Email */}
          <div className="flex items-center gap-3">
            <Typography
              text={user?.name}
              variant="heading1"
              className="font-semibold text-gray-800"
            />
            <span className="px-2 py-1 flex items-center text-xs text-white bg-[#2f3724] rounded-md">
              {user?.role == Role.Administrator && (
                <Bolt className="w-4 h-4 mr-1 text-white" />
              )}
              {user?.role}
            </span>
          </div>
          <Typography
            text={user?.email}
            variant="paragraph2"
            className="text-gray-500"
          />

          {/* Team and Approver */}
          <div className="mt-3 grid grid-cols-2 gap-4">
            <div>
              <Typography
                text="Team"
                variant="paragraph3"
                className="text-gray-400"
              />
              <Typography
                text={""}
                variant="paragraph2"
                className="text-gray-800"
              />
            </div>
            <div>
              <Typography
                text="Approver"
                variant="paragraph3"
                className="text-gray-400"
              />
              <Typography
                text={""}
                variant="paragraph2"
                className="text-gray-800"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Right Section: View Full Profile Button */}
      <div className="self-start">
        <button className="px-4 py-2 text-sm text-green-600 border border-green-600 rounded-md hover:bg-green-50">
          View full profile
        </button>
      </div>
    </div>
  );
};

export default ProfileHeader;
