import React from "react";
import Typography from "@/app/(dashboard)/_components/Typography";
import { renderStringWithEmoji } from "../../leave-policy/_components/LeavePolicyTable";
import { LeaveStatus } from "@prisma/client";
import { cn } from "@/lib/utils";

const LeaveRecordField = ({
  date,
  type,
  approver,
  deducted,
  status,
  message,
}) => {
  const isApproved = status == LeaveStatus.APPROVED;
  const isPending = status == LeaveStatus.PENDING;

  return (
    <div className="flex justify-between items-center py-4">
      <div className="w-1/3">
        <Typography
          text={date}
          variant="paragraph3"
          className="text-grey/500 font-bold"
        />
        {deducted && (
          <Typography
            text={deducted + " " + message}
            variant="label"
            className="font-medium text-grey/400"
          />
        )}
      </div>

      <div className="w-1/3 text-center">
        <Typography
          variant="paragraph3"
          className="font-semibold text-grey/500"
        >
          {renderStringWithEmoji(type)}
        </Typography>
      </div>

      <div className="w-1/3 text-right flex items-center gap-1 justify-end">
        <Typography
          variant="label"
          className={cn(
            "py-[2px] px-2 font-semibold border rounded-[16px] inline-block",
            isApproved
              ? "text-success-700 bg-success-50 border-success-200"
              : isPending
              ? "text-warning/700 bg-warning/50 border-warning/200"
              : "text-error-700 bg-error-50 border-error-200"
          )}
        >
          {isApproved
            ? "Approved"
            : isPending
            ? "Approval Pending"
            : "Rejected"}
        </Typography>
        <Typography className="font-semibold text-grey/400" variant="label">
          {isPending ? "From" : "By"} {approver}
        </Typography>
      </div>
    </div>
  );
};

export default LeaveRecordField;
