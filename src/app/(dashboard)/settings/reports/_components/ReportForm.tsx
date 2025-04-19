import Typography from "@/app/(dashboard)/_components/Typography";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useAppStore from "@/store/app";
import { useMemo, useRef, useState } from "react";
import SelectTeam, {
  addTeamName,
  removeTeamName,
} from "../../_components/SelectTeam";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import ReportOptions from "./ReportOptions";
import DownloadButton from "./DownloadButton";
import { toast } from "sonner";
import useUserStore from "@/store/user";
// import * as XLSX from "xlsx";
import XLSX from "xlsx-js-style";
import { saveAs } from "file-saver";
import useLeaveStore from "@/store/leave";
import {
  getLeaveTime,
} from "../../leave-record/_components/LeaveRecordsList";
import dayjs from "dayjs";
import { getDeducted } from "@/utils/helpers/getDeductes";

const ReportForm = () => {
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const { allUsers } = useAppStore();
  const { company } = useUserStore();
  const { leavePolicy } = useLeaveStore();

  const totalBalance = useMemo(() => {
    if (!Array.isArray(leavePolicy)) return 0; // Handle cases where leavePolicy is undefined/null

    return leavePolicy.reduce((acc, curr) => acc + (curr?.allowance ?? 0), 0);
  }, [leavePolicy]);

  const [form, setForm] = useState<{
    cycle: string;
    team: string | null;
    members: string | null;
    type: string;
  }>({
    cycle: new Date().getFullYear() + "",
    team: null,
    members: null,
    type: "summary",
  });

  const setTeam = (value) => {
    setForm({ ...form, team: value });
  };

  const handleClick = (e) => {
    const members = form.members
      ? JSON.parse(form.members)
      : { text: "", id: [] };

    const targetValue = (e.target as HTMLElement).getAttribute("data-value");

    if (!targetValue) return;

    if (targetValue == "all") return setForm({ ...form, members: null });

    const member = allUsers?.find((user) => user.id == targetValue);

    if (!member) return;

    if (members.id.includes(targetValue)) {
      setForm({
        ...form,
        members: JSON.stringify({
          text: removeTeamName(members.text, member?.name),
          id: members.id.filter((data) => data != targetValue),
        }),
      });
    } else {
      members.id.push(targetValue);
      setForm({
        ...form,
        members: JSON.stringify({
          text: addTeamName(members.text, member?.name),
          id: members.id,
        }),
      });
    }
  };

  const handleDownload = async () => {
    try {
      const toastId = toast.info("Fetching data...", { duration: Infinity });

      const res = await fetch(
        "/api/leave/download?company=" +
          company?.id +
          "&body=" +
          JSON.stringify(form)
      );

      if (res.status == 200) {
        const isSummary = form.type == "summary";
        const response = await res.json();

        const headers = isSummary
          ? [
              "Team",
              "Team Member",
              "Team",
              "Approver",
              "Leave Taken",
              "Leave Balance",
            ]
          : [
              "Sr No",
              "Date",
              "Team Member",
              "Team",
              "Reason",
              "Duration",
              "Leave Type",
              "Status",
              "Approver",
              "Leave Deducted",
            ];

        const data = isSummary
          ? response
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((data, index) => {
                const totalLeaves = data.leaveRecord.reduce((acc, res) => {
                  return (
                    acc -
                    getDeducted(
                      res.start,
                      res.end,
                      res.startTime,
                      res.endTime,
                      dayjs(res.end).isValid()
                    )
                  );
                }, totalBalance);

                return [
                  index + 1,
                  data.name,
                  data.teams,
                  data.approver,
                  data.leaveRecord.length ?? 0,
                  totalLeaves,
                ];
              })
          : response
              .sort((a, b) =>
                b.leaveRecord.start.localeCompare(a.leaveRecord.start)
              )
              .map((data, index) => {
                const deducted = getDeducted(
                  data.leaveRecord.start,
                  data.leaveRecord.end,
                  data.leaveRecord.startTime,
                  data.leaveRecord.endTime,
                  dayjs(data.leaveRecord.end).isValid()
                );

                return [
                  index + 1,
                  dayjs(data.leaveRecord.start, "YYYY-MM-DD").format(
                    "MMM DD, YY"
                  ),
                  data.name,
                  data.teams,
                  data.leaveRecord.reason || "Not provided",
                  deducted == 0.5
                    ? getLeaveTime(data.leaveRecord.startTime, true)
                    : deducted + " days",
                  data.type.split(" ").slice(1).join(" "),
                  data.leaveRecord.status,
                  data.approver,
                  deducted,
                ];
              });

        const worksheetData = [headers, ...(data ? data : [])];

        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

        // Set column width for better visibility
        worksheet["!cols"] = isSummary
          ? [
              { wch: 15 }, // Team
              { wch: 25 }, // Team Member
              { wch: 40 }, // Team
              { wch: 25 }, // Approver
              { wch: 20 }, // Leave Taken
              { wch: 20 }, // Leave Balance
            ]
          : [
              { wch: 15 }, // Sr No
              { wch: 20 }, // Date
              { wch: 25 }, // Team Member
              { wch: 40 }, // Team
              { wch: 50 }, // Reason
              { wch: 20 }, // Duration
              { wch: 25 }, // Leave Type
              { wch: 20 }, // Status
              { wch: 25 }, // Approver
              { wch: 20 }, // Leave Deducted
            ];

        // Get the range of the worksheet
        const range = XLSX.utils.decode_range(worksheet["!ref"] ?? "A1:J1");

        // Style for headers (first row)
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

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Leave Records");

        // Generate and save the Excel file
        const excelBuffer = XLSX.write(workbook, {
          bookType: "xlsx",
          type: "array",
          cellStyles: true, // Important: Enable cell styles
        });

        const excelBlob = new Blob([excelBuffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        saveAs(
          excelBlob,
          "_" +
            company?.name?.toLocaleLowerCase() +
            (isSummary ? "_leave_summary_" : "_leave_record_") +
            form.cycle +
            ".xlsx"
        );

        toast.dismiss(toastId);
      } else {
        toast.dismiss(toastId);
        toast.error("Error fetching data!");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unexpected error occured"
      );
    }
  };

  return (
    <div>
      <Typography
        text="Leave cycle"
        variant="paragraph3"
        className="font-semibold text-grey/500 mb-2"
      />
      <Select
        value={form.cycle}
        onValueChange={(value) => {
          setForm({ ...form, cycle: value });
        }}
      >
        <SelectTrigger className="py-[10px] px-[14px] w-full rounded-[8px]">
          <SelectValue placeholder="Select cycle" />
        </SelectTrigger>
        <SelectContent>
          {Array.from({ length: new Date().getFullYear() - 2024 + 1 }).map(
            (_, index) => {
              return (
                <SelectItem
                  key={index}
                  value={2024 + index + ""}
                  className="text-base"
                >
                  January - December {2024 + index}{" "}
                  {new Date().getFullYear() == 2024 + index &&
                    "(Current Cycle)"}
                </SelectItem>
              );
            }
          )}
        </SelectContent>
      </Select>

      <div className="flex gap-5 mt-5">
        <div className="w-full">
          <Typography
            text="Select team (optional)"
            className="text-grey/400 font-semibold"
            variant="paragraph3"
          />

          <SelectTeam team={form.team ?? ""} setTeam={setTeam} />
        </div>

        <div className="w-full">
          <Typography
            text="Select members (optional)"
            className="text-grey/400 font-semibold"
            variant="paragraph3"
          />
          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                "py-[10px] px-[14px] rounded-[8px] border border-grey-300 flex justify-between w-full focus:outline-none",
                form.members ? "text-grey/500" : "text-grey/400"
              )}
              ref={triggerRef}
            >
              <Typography
                text={
                  !form.members
                    ? "All members"
                    : JSON.parse(form.members).text || "All members"
                }
                variant="paragraph2"
              />{" "}
              <ChevronDown color="#667085" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              onClick={handleClick}
              style={{
                width: `${triggerRef.current?.offsetWidth}px`,
              }}
              className="max-h-[30vh] overflow-y-auto no-scrollbar"
            >
              <CustomItem
                text="Everyone at zazzy"
                members={form.members}
                value="all"
                border={true}
              />
              {allUsers
                ?.sort((a, b) => a.name.localeCompare(b.name))
                .map((user) => {
                  return (
                    <CustomItem
                      key={user.id}
                      members={form.members}
                      value={user.id}
                      text={user.name}
                    />
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <hr className="my-6" />

      <ReportOptions
        selectedOption={form.type}
        setSelectedOption={(value) => {
          setForm({ ...form, type: value });
        }}
      />

      <div className="p-6 bg-white">
        <div className="mt-8">
          <DownloadButton
            text="Download balance summary"
            onClick={handleDownload}
          />
        </div>
      </div>
    </div>
  );
};

const CustomItem = ({
  members,
  value,
  text,
  border,
}: {
  members: string | null;
  value: string;
  text: string;
  border?: boolean;
}) => {
  return (
    <DropdownMenuItem
      data-value={value}
      className="flex items-center w-full px-2 relative"
    >
      <Checkbox
        checked={members ? JSON.parse(members).id.includes(value) : true}
      />
      <Typography
        text={text}
        variant="paragraph2"
        className="text-grey/500 pointer-events-none"
      />
      {border && <hr className="absolute w-screen bottom-0 -left-2" />}
    </DropdownMenuItem>
  );
};

export default ReportForm;
