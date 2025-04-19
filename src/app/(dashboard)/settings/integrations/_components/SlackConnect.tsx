"use client";

import React from "react";
import Typography from "@/app/(dashboard)/_components/Typography";
import Messagecuate from "@assets/MessageCuate";
import Slack from "@assets/Slack";
import useUserStore from "@/store/user";
import {
  toastFullfilled,
  toastPending,
} from "@/app/(dashboard)/_components/Toast";

const SlackConnect = () => {
  const { connectUpdateSlackNotification, company } = useUserStore();

  return (
    <div className="flex items-center gap-6 bg-[#FCFCFD] p-6 border border-[#F2F4F7] shadow-sm rounded-lg">
      {/* Left Side: Image */}
      <div>
        <Messagecuate />
      </div>

      {/* Right Side: Content */}
      <div className="pl-6">
        <Typography
          variant="heading1"
          text="It looks like your slack isn't connected yet!"
          className="font-[Mulish] text-[#1E2318] text-[18px] font-semibold leading-[28.8px]"
        />
        <div className="mt-2">
          <Typography
            variant="paragraph1"
            text="Why connect?"
            className="font-[Mulish] text-[#667085] text-[16px]  leading-[24px]"
          />
          <ul className="mt-2 ml-4 space-y-2 list-disc text-[#667085]">
            <li>
              <Typography
                variant="paragraph3"
                text="Make leave requests without leaving Slack—just type, select & done!"
                className="font-[Mulish] text-[#667085] text-[14px] font-normal leading-[21px]"
              />
            </li>
            <li>
              <Typography
                variant="paragraph3"
                text="Get instant leave updates straight in your channels"
                className="font-[Mulish] text-[#667085] text-[14px] font-normal leading-[21px]"
              />
            </li>
            <li>
              <Typography
                variant="paragraph3"
                text="Notify your team when you're off (no awkward moments)"
                className="font-[Mulish] text-[#667085] text-[14px] font-normal leading-[21px]"
              />
            </li>
          </ul>
        </div>

        {/* Google Calendar Button */}
        <button
          onClick={async () => {
            if (company) {
              const toastId = toastPending("Connecting slack...");
              const res = await connectUpdateSlackNotification({
                companyId: company.id,
                slackNotification: true,
              });
              toastFullfilled(
                toastId,
                res,
                "Slack connected successfully",
                "Error connecting slack"
              );
            }
          }}
          className="flex items-center gap-3 mt-6 px-4 py-2 bg-[#4A154B] border  shadow-sm rounded-lg"
        >
          <div className="flex-col text-left">
            <Typography
              variant="paragraph3"
              text="Connect with slack"
              className="font-[Mulish] font-semibold text-[white] leading-[22px]"
            />
          </div>
          <Slack size={32} />
        </button>
      </div>
    </div>
  );
};

export default SlackConnect;
