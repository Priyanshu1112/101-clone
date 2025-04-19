"use client";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import Typography from "@/app/(dashboard)/_components/Typography";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { generateTimeOptions } from "../../integrations/_components/SlackSettings";
import { LeaveSummary } from "@types";
import { Company } from "@prisma/client";
import useAppStore from "@/store/app";
import dayjs from "dayjs";
import localeData from "dayjs/plugin/localeData";
import {
  toastFullfilled,
  toastPending,
} from "@/app/(dashboard)/_components/Toast";
import {
  toastUpdating,
  toastUpdatingError,
  toastUpdatingSuccess,
} from "@/utils/constant/toastMessage";
import useUserStore from "@/store/user";
import { toast } from "sonner";
dayjs.extend(localeData);

const NotificationTable = ({
  company,
  isDaily = false,
  edit,
  setEdit,
}: {
  isDaily?: boolean;
  company: Company | null;
  edit: boolean;
  setEdit: Dispatch<SetStateAction<boolean>>;
}) => {
  const { updateLeaveSummary } = useUserStore();
  const { channels } = useAppStore();
  const [summary, setSummary] = useState<LeaveSummary | null>(null);

  useEffect(() => {
    const data = isDaily
      ? company?.dailyLeaveSummary ?? ""
      : company?.weeklyLeaveSummary ?? "";

    try {
      setSummary(data as unknown as LeaveSummary);
    } catch (error) {
      console.error("Error parsing data:", error);
      setSummary(null); // Fallback for invalid JSON
    }
  }, [company, isDaily]);

  const handleConfirm = async () => {
    if (!summary || !summary.channel || !summary.time)
      return toast.error("All fields are required!");

    if (!isDaily && !summary.day)
      return toast.error("All fields are required!");

    const toastId = toastPending(toastUpdating("Leave summary"));

    const res = await updateLeaveSummary(summary, isDaily);

    toastFullfilled(
      toastId,
      res,
      toastUpdatingSuccess("Leave summary"),
      toastUpdatingError("Leave summary"),
      setEdit
    );
  };

  return (
    <div className="mt-5">
      <Table>
        <TableHeader>
          <TableRow className="bg-grey-200 text-grey/400 hover:bg-grey-200">
            <TableHead className="p-4">
              <Typography
                text="Notification time"
                variant="paragraph2"
                className="font-semibold text-[#667085]"
              />
            </TableHead>
            <TableHead className="p-4">
              <Typography
                text="Slack channel"
                variant="paragraph2"
                className="font-semibold text-[#667085]"
              />
            </TableHead>
            <TableHead className="p-4">
              <Typography
                text=""
                variant="paragraph2"
                className="font-semibold text-[#667085]"
              />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="min-h-fit">
          <TableRow
            className="text-[#667085] hover:bg-grey-100"
            style={{
              boxShadow: "0px 1px 2px 0px #1018280D",
            }}
          >
            {edit ? (
              // Edit mode
              <>
                <TableCell className="p-4">
                  <div className="flex gap-4 items-center">
                    {isDaily ? (
                      <Typography
                        text="Every weekday"
                        variant="paragraph3"
                        className="text-grey/400 px-[14px] py-[10px] border rounded-[8px] bg-grey-50 cursor-not-allowed"
                      />
                    ) : (
                      <Select
                        value={summary?.day}
                        onValueChange={(value) =>
                          setSummary((state) => {
                            if (!state) {
                              // Handle the case where state is null
                              return {
                                time: "",
                                day: value,
                                channel: "",
                              };
                            }
                            // Return the updated state while preserving existing fields
                            return { ...state, day: value };
                          })
                        }
                      >
                        <SelectTrigger className="h-[40px] w-[180px] border-[#D0D5DD] rounded-md text-[#667085] shadow-sm">
                          <SelectValue
                            placeholder="Select day"
                            className="font-normal"
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {dayjs
                            .localeData()
                            .weekdays()
                            .map((option, i) => (
                              <SelectItem key={i} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    )}
                    <Select
                      value={summary?.time}
                      onValueChange={(value) =>
                        setSummary((state) => {
                          if (!state) {
                            // Handle the case where state is null
                            return {
                              time: value,
                              day: "",
                              channel: "",
                            };
                          }
                          // Return the updated state while preserving existing fields
                          return { ...state, time: value };
                        })
                      }
                    >
                      <SelectTrigger className="h-[40px] w-[180px] border-[#D0D5DD] rounded-md text-[#667085] shadow-sm">
                        <SelectValue
                          placeholder="Select time"
                          className="font-normal"
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {generateTimeOptions().map((option, i) => (
                          <SelectItem key={i} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </TableCell>
                <TableCell className="p-4">
                  <Select
                    value={summary?.channel}
                    onValueChange={(value) => {
                      setSummary((state) => {
                        if (!state) {
                          // Handle the case where state is null
                          return {
                            time: "",
                            day: "",
                            channel: value,
                          };
                        }
                        // Return the updated state while preserving existing fields
                        return { ...state, channel: value };
                      });
                    }}
                  >
                    <SelectTrigger className="h-[40px] w-[180px] border-[#D0D5DD] rounded-md text-[#667085] shadow-sm">
                      <SelectValue
                        placeholder="Select channel"
                        className="font-normal"
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {(
                        channels?.map(
                          (channel) => channel.id + "|" + channel.name
                        ) ?? []
                      )
                        .sort((a, b) =>
                          a.split("|")[1].localeCompare(b.split("|")[1])
                        )
                        .map((option, i) => (
                          <SelectItem key={i} value={option.split("|")[0]}>
                            {option.split("|")[1]}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="p-4">
                  <button
                    className="h-[40px] w-[100px] border border-grey/400 rounded-lg mr-2"
                    style={{ boxShadow: "0px 1px 2px 0px #1018280D" }}
                    onClick={() => {
                      setEdit(false);
                    }}
                  >
                    <Typography
                      text="Cancel"
                      variant="paragraph3"
                      className="font-semibold text-[#2F1847]"
                    />
                  </button>
                  <button
                    className="h-[40px] w-[100px] bg-[#FAFF7D] rounded-lg"
                    style={{ boxShadow: "0px 1px 2px 0px #1018280D" }}
                    onClick={handleConfirm}
                  >
                    <Typography
                      text="Confirm"
                      variant="paragraph3"
                      className="font-semibold text-[#2F1847]"
                    />
                  </button>
                </TableCell>
              </>
            ) : (
              // Normal mode
              <>
                <TableCell className="p-4">
                  <Typography
                    text={`Every ${isDaily ? "weekday" : summary?.day}`}
                    variant="paragraph3"
                    className="font-semibold text-[#344054]"
                  />
                  <Typography
                    text={"at " + summary?.time}
                    variant="label"
                    className="text-[#667085]"
                  />
                </TableCell>
                <TableCell className="p-4">
                  <Typography
                    text={
                      channels?.find(
                        (channel) => channel.id == summary?.channel
                      )?.name
                    }
                    variant="paragraph3"
                    className="font-semibold text-[#667085]"
                  />
                </TableCell>
                <TableCell
                  className="p-4 text-[#667085] cursor-pointer"
                  onClick={() => {
                    setEdit(true);
                  }}
                >
                  <Typography
                    text="Edit"
                    variant="paragraph3"
                    className=" font-semibold underline "
                  />
                </TableCell>
              </>
            )}
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default NotificationTable;
