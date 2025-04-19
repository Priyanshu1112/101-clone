import React from "react";
import Typography from "@/app/(dashboard)/_components/Typography";

const ReportHeader: React.FC = () => {
  return (
    <div className="border-b border-gray-200 pb-2">
      {/* Main Header */}
      <Typography
        text="Download team leave report"
        variant="heading1"
        className="text-gray-800 font-semibold"
      />
    </div>
  );
};

export default ReportHeader;