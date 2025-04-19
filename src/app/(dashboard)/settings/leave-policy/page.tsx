"use client";
import React, { useState } from "react";
import LeavePolicyHeader from "./_components/LeavePolicyHeader";
import AddEditLeave, { FormType } from "./_components/AddEditLeave";
import useLeaveStore, { FetchStatus } from "@/store/leave";
import Typography from "../../_components/Typography";
import { Plus } from "lucide-react";
import { LeaveType } from "@prisma/client";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import LeavePolicyTable from "./_components/LeavePolicyTable";

const LeavePolicyPage = () => {
  const { fetchPolicy, leavePolicy } = useLeaveStore();
  const [totalDed, setTotalDed] = useState(0);

  return (
    <div className="p-6  bg-white rounded-lg shadow-sm border border-gray-200 w-full">
      {fetchPolicy == FetchStatus.PENDING ? (
        <div className="w-full h-10">
          <Typography text="Loading..." variant="heading1" />
        </div>
      ) : leavePolicy && leavePolicy.length > 0 ? (
        <>
          {/* Deductible Leaves Section */}

          <LeavePolicyHeader
            title="Deductible Leaves"
            linkText="How do deductibles work?"
            type={FormType.Deductible}
            total={totalDed}
          />
          <LeavePolicyTable
            type={LeaveType.Deductible}
            total={totalDed}
            setTotal={setTotalDed}
          />

          {/* Non-Deductible Leaves Section */}
          <LeavePolicyHeader
            title="Non-deductible Leaves"
            linkText="How do non-deductibles work?"
            type={FormType.Non_Deductible}
          />
          <LeavePolicyTable type={LeaveType.Non_Deductible} />
        </>
      ) : (
        <div className="w-full flex flex-col gap-10">
          <AddLeave type={LeaveType.Deductible} />
          <AddLeave type={LeaveType.Non_Deductible} />
        </div>
      )}
    </div>
  );
};

const AddLeave = ({ type }: { type: LeaveType }) => {
  const isDeductible = type == LeaveType.Deductible;
  const [open, setOpen] = React.useState<boolean>(false);

  return (
    <div
      className="rounded-[12px]  w-full px-6 py-5 border border-grey-200 overflow-x-hidden"
      style={{
        boxShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
      }}
    >
      <span className="block pb-5">
        <Typography
          text={isDeductible ? "Deductible Leaves" : "Non-deductible Leaves"}
          variant="paragraph1"
          className="font-bold text-grey/500"
        />
        <Typography
          variant="label"
          text={
            isDeductible
              ? "Leave deducted from allowed as per policy"
              : "Time off that doesn't count against already allotted "
          }
          className="text-grey/400"
        />
      </span>
      <div className="pt-5 flex justify-center relative">
        <hr className="absolute top-0 -left-6 w-screen border-grey-200" />
        <Typography
          variant="paragraph2"
          className="font-semibold text-grey/400 flex items-center gap-3"
        >
          You haven&apos;t added any{" "}
          {isDeductible ? "deductible" : "non-deductible"} leaves. Let&apos;s
          create them now!
          <Sheet open={open} onOpenChange={(value) => setOpen(value)}>
            <SheetTrigger
              className="bg-brand/main text-dark flex items-center gap-1 hover:bg-brand/main/50 px-[14px] py-[10px] rounded-[8px] border border-brand/main"
              style={{
                boxShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
              }}
            >
              <Plus size={20} />
              <Typography
                text={
                  isDeductible
                    ? "Create deductible leaves"
                    : "Create non-deductible leaves"
                }
                variant="paragraph3"
                className="font-semibold"
              />
            </SheetTrigger>
            <SheetContent className="p-0 min-w-[500px] flex flex-col overflow-y-auto overflow-x-hidden">
              <AddEditLeave
                type={
                  isDeductible ? FormType.Deductible : FormType.Non_Deductible
                }
                setOpen={setOpen}
              />
            </SheetContent>
          </Sheet>
        </Typography>
      </div>
    </div>
  );
};

export default LeavePolicyPage;
