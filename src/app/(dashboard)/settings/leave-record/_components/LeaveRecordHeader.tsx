"use client";

import { Dispatch, SetStateAction, useMemo } from "react";
import Typography from "@/app/(dashboard)/_components/Typography";

// Import your custom icons
import { LeftArrowIcon, RightArrowIcon } from "@assets/ArrowIcon";

import DownloadIcon from "@assets/DownloadIcon";
import useLeaveStore from "@/store/leave";
import dayjs from "dayjs";
import XLSX from "xlsx-js-style";
import { saveAs } from "file-saver";
import useUserStore from "@/store/user";
import { toast } from "sonner";
import { getDeducted } from "@/utils/helpers/getDeductes";
import { getLeaveTime } from "./LeaveRecordsList";

const headers = [
  "Sr No",
  "Date",
  "Reason",
  "Duration",
  "Leave Type",
  "Status",
  "Approver",
  "Leave Deducted",
  "Total Balance Leaves",
];

const LeaveRecordHeader = ({
  dateRange,
  setDateRange,
}: {
  dateRange: number;
  setDateRange: Dispatch<SetStateAction<number>>;
}) => {
  const { leaveRecords, leavePolicy } = useLeaveStore();
  const { user } = useUserStore();

  const totalBalance = useMemo(() => {
    if (!Array.isArray(leavePolicy)) return 0; // Handle cases where leavePolicy is undefined/null

    return leavePolicy.reduce((acc, curr) => acc + (curr?.allowance ?? 0), 0);
  }, [leavePolicy]);

  // Function to handle export
  const handleExport = () => {
    try {
      let lastBalance = totalBalance;

      const data = leaveRecords
        ?.filter(
          (record) =>
            dayjs(record.start, "YYYY-MM-DD").format("YYYY") ==
            dateRange.toString()
        )
        .map((record, index) => {
          const deducted = getDeducted(
            record.start,
            record.end,
            record.startTime,
            record.endTime,
            dayjs(record.end).isValid()
          );

          lastBalance = lastBalance - deducted;

          return [
            index + 1,
            dayjs(record?.start, "YYYY-MM-DD").format("MMM D, YY"),
            record?.reason || "Not provided",
            deducted == 0.5
              ? getLeaveTime(record.startTime, true)
              : deducted + " days",
            record?.leaveDetail?.name?.split(" ").slice(1).join(" "),
            record?.status,
            record?.approvedBy?.name || "N/A",
            deducted,
            lastBalance,
          ];
        });

      const worksheetData = [headers, ...(data ? data : [])];

      // Create a worksheet
      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

      // Apply styles to headers
      const range = XLSX.utils.decode_range(worksheet["!ref"] ?? "");

      for (let C = range.s.c; C <= range.e.c; ++C) {
        const headerAddress = XLSX.utils.encode_cell({ r: 0, c: C });
        worksheet[headerAddress].s = {
          font: {
            bold: true,
            color: { rgb: "FFFFFF" }, // White text
            sz: 16, // Font size
          },
          fill: {
            patternType: "solid",
            fgColor: { rgb: "7E8475" }, // Dark green
            bgColor: { rgb: "7E8475" },
          },
          alignment: {
            horizontal: "center",
            vertical: "center",
            wrapText: true,
          },
          border: {
            top: { style: "thin" },
            bottom: { style: "thin" },
            left: { style: "thin" },
            right: { style: "thin" },
          },
        };
      }

      // Style for data cells
      for (let R = 1; R <= range.e.r; ++R) {
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
          if (!worksheet[cellAddress]) continue;

          worksheet[cellAddress].s = {
            font: {
              sz: 14, // Font size for data
            },
            alignment: {
              horizontal: "center",
              vertical: "center",
              wrapText: true,
            },
            border: {
              top: { style: "thin" },
              bottom: { style: "thin" },
              left: { style: "thin" },
              right: { style: "thin" },
            },
          };
        }
      }

      // Set column width for better visibility
      worksheet["!cols"] = [
        { wch: 15 }, // Sr No
        { wch: 20 }, // Date
        { wch: 40 }, // Reason
        { wch: 20 }, // Duration
        { wch: 30 }, // Leave Type
        { wch: 15 }, // Status
        { wch: 30 }, // Approver
        { wch: 20 }, // Leave Deducted
        { wch: 30 }, // Total Balance Leaves
      ];

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Leave Records");

      // Generate and save the Excel file
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      const excelBlob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      saveAs(
        excelBlob,
        "_" +
          user?.name?.toLocaleLowerCase() +
          "_leave_record_" +
          dateRange +
          ".xlsx"
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "An error occurred!"
      );
    }
  };

  return (
    <div className="flex justify-between items-center p-6 bg-white rounded-md border-b border-gray-200">
      <div className="flex items-center gap-4">
        <button
          className="p-1 rounded-full hover:bg-gray-100"
          onClick={() => setDateRange(dateRange - 1)}
        >
          {/* Left arrow icon */}
          <LeftArrowIcon />
        </button>

        <Typography
          text={"Jan - Dec " + dateRange.toString()}
          variant="display4"
          className="font-semibold text-[#2F1847]"
        />

        <button
          className="p-1 rounded-full hover:bg-gray-100"
          onClick={() => setDateRange(dateRange + 1)}
        >
          {/* Right arrow icon */}
          <RightArrowIcon />
        </button>
      </div>

      <button
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-100"
        onClick={handleExport}
      >
        <Typography
          text="Download XLSX"
          variant="paragraph2"
          className="font-semibold text-[#3D4630]"
        />
        {/* Download icon */}
        <DownloadIcon />
      </button>
    </div>
  );
};

export default LeaveRecordHeader;
