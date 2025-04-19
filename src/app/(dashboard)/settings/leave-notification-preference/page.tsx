"use client";
import DailyLeaveSummaryHeader from "./_components/DailyLeaveSummaryHeader";

import SlackSection from "./_components/SlackSection";
import WeeklyLeaveSummaryHeader from "./_components/WeelyLeaveSummaryHeader";
import useUserStore from "@/store/user";
import NotificationTable from "./_components/NotificationTable";
import { Dispatch, SetStateAction, useState } from "react";
import Typography from "../../_components/Typography";
import { Plus } from "lucide-react";

const Page = () => {
  const { company } = useUserStore();
  const [editDaily, setEditDaily] = useState(false);
  const [editWeekly, setEditWeekly] = useState(false);

  return (
    <div className="p-8 w-full  space-y-8 bg-white rounded-lg shadow-md">
      <SlackSection />
      <>
        <div className="space-y-0 border-[#F2F4F7] rounded-md shadow-md">
          <DailyLeaveSummaryHeader />
          {company?.dailyLeaveSummary || editDaily ? (
            <NotificationTable
              isDaily={true}
              company={company}
              edit={editDaily}
              setEdit={setEditDaily}
            />
          ) : (
            <EmptyFieldSummary
              message="Want to receive daily leave summaries in Slack!"
              buttonText="Daily leave summary notification"
              setState={setEditDaily}
            />
          )}
        </div>
        <div className="space-y-0 border-[#F2F4F7] rounded-md shadow-md">
          <WeeklyLeaveSummaryHeader />
          {company?.weeklyLeaveSummary || editWeekly ? (
            <NotificationTable
              company={company}
              edit={editWeekly}
              setEdit={setEditWeekly}
            />
          ) : (
            <EmptyFieldSummary
              message="Want to receive weekly leave summaries to plan effectively!"
              buttonText="Weekly leave summary notification"
              setState={setEditWeekly}
            />
          )}
        </div>
      </>
    </div>
  );
};

const EmptyFieldSummary = ({
  message,
  buttonText,
  setState,
}: {
  message: string;
  buttonText: string;
  setState: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <div
      className="rounded-[12px]  w-full px-6 py-5 border border-grey-200 overflow-x-hidden"
      style={{
        boxShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
      }}
    >
      <div className="pt-5 flex justify-center relative">
        <hr className="absolute top-0 -left-6 w-screen border-grey-200" />
        <Typography
          variant="paragraph2"
          className="font-semibold text-grey/400 flex items-center gap-3"
        >
          {message}
          <button
            className="bg-brand/main text-dark flex items-center gap-1 hover:bg-brand/main/50 px-[14px] py-[10px] rounded-[8px] border border-brand/main"
            style={{
              boxShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
            }}
            onClick={() => setState(true)}
          >
            <Plus size={20} />
            <Typography
              text={buttonText}
              variant="paragraph3"
              className="font-semibold"
            />
          </button>
        </Typography>
      </div>
    </div>
  );
};

export default Page;
