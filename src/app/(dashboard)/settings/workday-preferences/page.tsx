"use client";
import React, { useState } from "react";
import WorkPreferencesHeader from "./_components/WorkPreferencesHeader";
import WorkTable from "./_components/WorkTable";
import useTeamStore from "@/store/team";
import EmptyField from "../_components/EmptyField";
import { Plus } from "lucide-react";
import AddEditWorkday from "./_components/AddEditWorkday";

const Page = () => {
  const { workDays } = useTeamStore();
  const [open, setOpen] = useState(false);
  return (
    <div className="p-8 w-full border bg-white rounded-lg shadow-md">
      {workDays && workDays.length > 0 ? (
        <>
          <WorkPreferencesHeader />
          <WorkTable />
        </>
      ) : (
        <EmptyField
          Icon={Plus}
          title="Workday"
          supportText="Plan, track, and manage your workdays across seamlessly"
          buttonText="Define workday"
          message="Collaborate better with an employee-first mindset."
          open={open}
          setOpen={setOpen}
          content={<AddEditWorkday setOpen={setOpen} />}
        />
      )}
    </div>
  );
};

export default Page;
