import { CustomLeaveDetail } from "@/store/user";
import React from "react";
import Typography from "../../_components/Typography";
import { LeaveType } from "@prisma/client";
import { renderStringWithEmoji } from "../../settings/leave-policy/_components/LeavePolicyTable";

interface LeaveDetailsProps {
  detail: CustomLeaveDetail;
  currentDetail: { year: string; taken: string; balance: string } | undefined;
}

const LeaveDetails = ({ detail, currentDetail }: LeaveDetailsProps) => {
  return (
    <div>
      {/* HEAD */}
      <div className="flex flex-col gap-3 items-start">
        <span
          className={`px-3 py-1 rounded-full border-success-200 border ${
            detail.type == LeaveType.Deductible
              ? "bg-success-50 text-[#067647]"
              : "bg-[#FFFAEB] text-[#B54708]"
          }`}
        >
          <Typography
            text={detail.type}
            variant="label"
            className="text-[12px] font-semibold leading-[19.68px] text-center"
          />
        </span>
        <div>
          <div className="flex items-baseline gap-2">
            <Typography
              text={`${currentDetail?.taken ?? 0}/${detail.allowance}`}
              variant="display3"
              className="text-[#2F1847] font-bold text-[32px] leading-[51.2px]"
            />
            <Typography
              text="Taken"
              variant="paragraph3"
              className="text-[#667085] text-[14px] leading-[22.96px] font-normal"
            />
          </div>
          <Typography variant="heading1">
            {renderStringWithEmoji(detail.name)}
          </Typography>
        </div>
      </div>

      {/* BODY */}
      <div className="mt-6">
        <Typography
          text="Allowance"
          variant="label"
          className="font-semibold text-grey/400"
        />
        <Typography
          text={`Credited ${detail.allowance} / ${detail.allowanceType?.slice(
            0,
            -2
          )}`}
          variant="paragraph3"
          className="text-grey/500 font-semibold"
        />
      </div>

      <div
        className="mt-6 pt-6 flex flex-col gap-3"
        style={{
          borderTop: "1px solid rgba(245, 95, 20, 0.50)",
        }}
      >
        <div className="w-full flex justify-between items-center">
          <Typography
            variant="paragraph3"
            text="Paid leave allowance from this cycle"
            className="text-grey/500 font-semibold"
          />
          <Typography
            variant="paragraph3"
            text={"+" + detail.allowance}
            className="text-grey/500 font-semibold"
          />
        </div>
        <div className="w-full flex justify-between items-center">
          <Typography
            variant="paragraph3"
            text="Taken"
            className="text-grey/500 font-semibold"
          />
          <Typography
            variant="paragraph3"
            text={"-" + (currentDetail?.taken ?? 0)}
            className="text-grey/500 font-semibold"
          />
        </div>
        <div className="w-full flex justify-between items-center">
          <Typography
            variant="paragraph3"
            text="Added/reduced leaves"
            className="text-grey/500 font-semibold"
          />
          <Typography
            variant="paragraph3"
            text={"0"}
            className="text-grey/500 font-semibold"
          />
        </div>
      </div>

      <div
        className="mt-6 pt-6 flex justify-between items-center w-full"
        style={{
          borderTop: "1px solid rgba(245, 95, 20, 0.50)",
        }}
      >
        <Typography
          variant="paragraph3"
          text={"Available balance"}
          className="text-grey/500 font-bold"
        />
        <Typography
          variant="paragraph3"
          text={(
            (detail.allowance ?? 0) - (Number(currentDetail?.taken) || 0)
          ).toString()}
          className="text-grey/500 font-bold"
        />
      </div>
    </div>
  );
};

export default LeaveDetails;
