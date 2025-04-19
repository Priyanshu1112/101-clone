"use client";

import { useParams } from "next/navigation";
import useAppStore from "@/store/app";
import { useEffect, useState } from "react";
import LeftPanel from "../_components/LeftPanel";
import DateNavigationHeader from "../_components/DateNavigationHeader";
import LeaveCategoryCard from "../_components/LeaveCategoryCard";

const ProfilePage = () => {
  const { id } = useParams();

  const {
    leaveDetail: activeUserLeaveDetail,
    activeUser,
    setActiveUser,
    allUsers,
  } = useAppStore();

  console.log(activeUserLeaveDetail)

  const [dateRange, setDateRange] = useState(new Date().getFullYear());

  useEffect(() => {
    setActiveUser(id as string);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allUsers]);

  return (
    <div className="flex gap-6 p-6 bg-white">
      {/* Left side */}
      <LeftPanel />

      {/* Right side */}
      <div className="w-2/3 space-y-6 p-6 border border-[#D0D5DD] bg-[white] rounded-lg ">
        {/* <ProfileHeader /> */}

        <DateNavigationHeader
          dateRange={dateRange}
          setDateRange={setDateRange}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {(activeUserLeaveDetail ?? [])
            ?.filter((detail) =>
              activeUser?.gender == "Male"
                ? detail.name.includes("Menstrual")
                  ? false
                  : true
                : true
            )
            ?.map((detail, index) => (
              <LeaveCategoryCard
                key={index}
                // title={detail.name}
                // taken={detail.taken.toString() || "0"}
                // allowance={detail.allowance?.toString() || ""}
                // allowanceType={detail.allowanceType || ""}
                // deductible={detail.type}
                dateRange={dateRange}
                detail={detail}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
