"use client";
import React, { useState } from "react";
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
} from "@/components/ui/select";

const WeeklyNotificationTable = () => {
  const [editRowIndex, setEditRowIndex] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>(""); // Stores the selected time
  const [selectedHour, setSelectedHour] = useState<string>(""); // Stores the selected hour
  const [selectedChannel, setSelectedChannel] = useState<string>(""); // Stores the selected slack channel

  // Dummy data for the table
  const [dummyData, setDummyData] = useState([
    {
      notificationText: "Every weekday",
      notificationTime: "at 8:30 AM",
      slackChannel: "#design_team",
    },
  ]);

  const timeOptions = ["Every weekday", "Every Monday", "Every Friday"];
  const hourOptions = ["8:30 AM", "10:00 AM", "3:00 PM"];
  const channelOptions = ["#design_team", "#marketing_team", "#engineering"];

  const handleConfirmClick = () => {
    if (editRowIndex !== null) {
      const updatedData = [...dummyData];
      updatedData[editRowIndex] = {
        notificationText:
          selectedTime || dummyData[editRowIndex].notificationText,
        notificationTime: `at ${
          selectedHour ||
          dummyData[editRowIndex].notificationTime.replace("at ", "")
        }`,
        slackChannel: selectedChannel || dummyData[editRowIndex].slackChannel,
      };
      setDummyData(updatedData);
    }
    setEditRowIndex(null); // Exit edit mode
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
          {dummyData.length ? (
            dummyData.map((row, index) => (
              <TableRow
                key={index}
                className="text-[#667085] hover:bg-grey-100"
                style={{
                  boxShadow: "0px 1px 2px 0px #1018280D",
                }}
              >
                {editRowIndex === index ? (
                  // Edit mode
                  <>
                    <TableCell className="p-4">
                      <div className="flex gap-4 items-center">
                        <Select
                          value={selectedTime || row.notificationText}
                          onValueChange={(value) => setSelectedTime(value)}
                        >
                          <SelectTrigger className="h-[40px] w-[180px] border-[#D0D5DD] rounded-md text-[#667085] shadow-sm">
                            <Typography
                              text={selectedTime || row.notificationText}
                              variant="paragraph2"
                              className="font-normal"
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {timeOptions.map((option, i) => (
                              <SelectItem key={i} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Select
                          value={
                            selectedHour ||
                            row.notificationTime.replace("at ", "")
                          }
                          onValueChange={(value) => setSelectedHour(value)}
                        >
                          <SelectTrigger className="h-[40px] w-[120px] border-[#D0D5DD] rounded-md text-[#667085] shadow-sm flex items-center gap-x-1">
                            <Typography
                              text={
                                selectedHour?.split(" ")[0] ||
                                row.notificationTime
                                  .replace("at ", "")
                                  .split(" ")[0]
                              } // Extracts "10:00"
                              variant="paragraph2"
                              className="font-normal"
                            />
                            <Typography
                              text={
                                selectedHour?.split(" ")[1] ||
                                row.notificationTime
                                  .replace("at ", "")
                                  .split(" ")[1]
                              } // Extracts "AM"
                              variant="paragraph3"
                              className="font-normal"
                            />
                          </SelectTrigger>

                          <SelectContent>
                            {hourOptions.map((option, i) => (
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
                        value={selectedChannel || row.slackChannel}
                        onValueChange={(value) => setSelectedChannel(value)}
                      >
                        <SelectTrigger className="h-[40px] w-[180px] border-[#D0D5DD] rounded-md text-[#667085] shadow-sm">
                          <Typography
                            text={selectedChannel || row.slackChannel}
                            variant="paragraph2"
                            className="font-normal"
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {channelOptions.map((option, i) => (
                            <SelectItem key={i} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="p-4">
                      <button
                        className="h-[40px] w-[100px] bg-[#FAFF7D] rounded-lg"
                        style={{ boxShadow: "0px 1px 2px 0px #1018280D" }}
                        onClick={handleConfirmClick}
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
                        text={row.notificationText}
                        variant="paragraph3"
                        className="font-semibold text-[#344054]"
                      />
                      <Typography
                        text={row.notificationTime}
                        variant="label"
                        className="text-[#667085]"
                      />
                    </TableCell>
                    <TableCell className="p-4">
                      <Typography
                        text={row.slackChannel}
                        variant="paragraph3"
                        className="font-semibold text-[#667085]"
                      />
                    </TableCell>
                    <TableCell
                      className="p-4 text-[#667085] cursor-pointer"
                      onClick={() => {
                        setEditRowIndex(index);
                        setSelectedTime(row.notificationText);
                        setSelectedHour(
                          row.notificationTime.replace("at ", "")
                        );
                        setSelectedChannel(row.slackChannel);
                      }}
                    >
                      <Typography
                        text="Edit"
                        variant="paragraph2"
                        className="underline font-normal"
                      />
                    </TableCell>
                  </>
                )}
              </TableRow>
            ))
          ) : (
            <TableRow style={{ height: "60px" }}>
              <TableCell colSpan={3} className="h-24 text-center">
                <Typography
                  text="No results."
                  variant="paragraph2"
                  className="text-[#667085]"
                />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default WeeklyNotificationTable;
