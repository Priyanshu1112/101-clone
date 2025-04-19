import React from "react";
import Typography from "@/app/(dashboard)/_components/Typography";
import AddNext from "../../_components/AddNext";
import AddEditWorkday from "./AddEditWorkday";

const WorkPreferencesHeader: React.FC = () => {
  return (
    <div className="p-6 bg-gray-50 border border-gray-100 rounded-t-lg border-b-0">
      <div className="flex justify-between items-center">
        {/* Header Title */}
        <Typography
          text="Workday"
          variant="heading1"
          className="font-semibold text-gray-800"
        />

        {/* Button with Typography */}
        <AddNext>
          <AddEditWorkday />
        </AddNext>
      </div>

      {/* Subtext Link */}
      <a>
        {" "}
        <Typography
          text="How to setup workday Calendar"
          variant="paragraph3"
          className="text-gray-500 underline  cursor-pointer"
        />
      </a>
    </div>
  );
};

export default WorkPreferencesHeader;
