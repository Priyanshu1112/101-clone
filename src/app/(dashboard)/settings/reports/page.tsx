"use client";

import ReportHeader from "./_components/ReportHeader";
import ReportForm from "./_components/ReportForm";

const ReportsPage = () => {
  return (
    <div className="p-8 border bg-white rounded-lg shadow-sm">
      {/* Report Header */}
      <ReportHeader />

      {/* Container for the sections */}
      <div className="border mt-6 border-gray-100 rounded-lg overflow-hidden">
        <div className="p-6 bg-white border-b border-gray-100">
          <ReportForm />
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
