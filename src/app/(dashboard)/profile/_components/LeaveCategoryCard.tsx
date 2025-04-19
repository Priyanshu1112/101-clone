import React, { useMemo } from "react";
import Typography from "@/app/(dashboard)/_components/Typography";
import { renderStringWithEmoji } from "../../settings/leave-policy/_components/LeavePolicyTable";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import LeaveDetails from "./LeaveDetails";
import { DialogTitle } from "@radix-ui/react-dialog";
import { CustomLeaveDetail } from "@/store/user";
import { LeaveType } from "@prisma/client";

const LeaveCategoryCard = ({
  detail,
  dateRange,
}: {
  detail: CustomLeaveDetail;
  dateRange: number;
}) => {
  const currentDetail = useMemo(() => {
    return detail?.detail?.find(
      (detail) => detail.year == dateRange.toString()
    );
  }, [dateRange, detail]);

  return (
    <div
      className={`p-6 rounded-lg shadow-sm flex flex-col justify-between  border`}
    >
      {/* Header */}
      <div className="flex justify-between items-center">
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
        <span
          className={`px-3 py-1 rounded-full ${
            detail.type == LeaveType.Deductible
              ? "bg-[#ECFDF3] text-[#067647]"
              : "bg-[#FFFAEB] text-[#B54708]"
          }`}
        >
          <Typography
            text={detail.type}
            variant="label"
            className="text-[12px] font-semibold leading-[19.68px] text-center"
          />
        </span>
      </div>

      {/* Body */}
      <div className="mt-4">
        <Typography
          text={renderStringWithEmoji(detail.name)}
          variant="heading1"
          className="text-[#344054] font-semibold flex "
        />
        {detail.type == LeaveType.Deductible && (
          <div className="flex justify-between items-center mt-2">
            <div>
              <Typography
                text="Allowance"
                variant="label"
                className="text-[#667085]"
              />
              <Typography
                text={`Credited ${detail.allowance} / ${detail.allowanceType?.slice(0, -2)}`}
                variant="paragraph3"
                className="text-grey/500 font-semibold"
              />
            </div>

            <Dialog>
              <DialogTrigger>
                <Typography
                  text="Details"
                  variant="paragraph3"
                  className="text-[#344054] text-[14px] leading-[22.96px] font-semibold underline decoration-solid"
                />
              </DialogTrigger>
              <DialogContent
                className="p-5"
                style={{
                  borderRadius: "12px",
                  border: "1px solid rgba(245, 95, 20, 0.50)",
                  background:
                    "linear-gradient(0deg, rgba(253, 228, 216, 0.50) 0%, rgba(253, 228, 216, 0.50) 100%), #FFF",
                }}
              >
                <DialogTitle>
                  <LeaveDetails detail={detail} currentDetail={currentDetail}/>
                </DialogTitle>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaveCategoryCard;
