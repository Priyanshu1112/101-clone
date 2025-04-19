"use client";

import { Clock, PlusCircle } from "lucide-react";
import React, { useState } from "react";
import Typography from "../../_components/Typography";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { UpdateResponseStatus } from "@prisma/client";
import useUserStore, { CustomUpdateResponse } from "@/store/user";
import UpdateForm from "./UpdateForm";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone"; // Timezone plugin
import utc from "dayjs/plugin/utc"; // UTC plugin
import { cn } from "@/lib/utils";
import { get12hr } from "@/utils/helpers/get12hour";

dayjs.extend(utc);
dayjs.extend(timezone);

const UpdateCard = ({ response }: { response: CustomUpdateResponse }) => {
  const checkTime = (time: string) => {
    const currentTime = dayjs(); // Get the current time
    const updateTime = dayjs(
      `${dayjs().tz("Asia/Kolkata").format("YYYY-MM-DD")} ${time}`,
      "YYYY-MM-DD HH:mm:ss"
    );

    if (
      updateTime.hour() < currentTime.hour() ||
      (updateTime.hour() === currentTime.hour() &&
        updateTime.minute() <= currentTime.minute())
    )
      return "AddUpdates";
    else return "Scheduled";
  };

  return (
    <>
      <div
        className={`min-w-[412px] max-w-[412px]  border-grey-300  rounded-[11px] ${
          response.status == UpdateResponseStatus.Scheduled
            ? checkTime(response.update.time) == "AddUpdates"
              ? "border border-grey/400"
              : "border-dashed"
            : "border"
        } ${response.status == UpdateResponseStatus.Complete && "bg-grey-50"} `}
        style={{
          ...(response.status == UpdateResponseStatus.Scheduled &&
            checkTime(response.update.time) !== "AddUpdates" && {
              boxShadow: "0px 4px 28px 0px rgba(0, 0, 0, 0.11)",
            }),
        }}
      >
        <div
          className={cn(
            "px-3 py-2 border-b flex justify-between items-center",
            response.status == UpdateResponseStatus.Scheduled &&
              checkTime(response.update.time) == "AddUpdates" &&
              "border-grey/400"
          )}
        >
          <span className="flex gap-6 items-center">
            <span className="flex items-center gap-1 ">
              <Clock size={20} color="#979FAF" />
              <Typography
                variant="paragraph3"
                text={get12hr(response.update.time)}
                className="text-grey/350 font-bold"
              />
            </span>
          </span>

          {response.status !== UpdateResponseStatus.Scheduled && (
            <div
              className={cn(
                "flex items-center gap-1 py-[2px] pr-2 pl-[6px] rounded-[16px] border",
                response.status == UpdateResponseStatus.Complete
                  ? "border-success-200 bg-success-50"
                  : "border-error-200 bg-error-50"
              )}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  response.status == UpdateResponseStatus.Complete
                    ? "bg-success-300"
                    : "bg-error-300"
                }`}
              ></div>
              <Typography
                text={
                  response.status == UpdateResponseStatus.Complete
                    ? "Submitted"
                    : "Incomplete"
                }
                className={cn(
                  "text-[10px]",
                  response.status == UpdateResponseStatus.Complete
                    ? "text-success-700"
                    : "text-error-700"
                )}
              />
            </div>
          )}
        </div>
        <div className="px-3 py-4 flex flex-col gap-5 h-full">
          {response.status !== UpdateResponseStatus.Scheduled ? (
            response.update ? (
              response?.update?.questions?.map((question, index) => {
                return (
                  <div key={index}>
                    <Typography
                      variant="paragraph3"
                      className={cn(
                        "font-bold mb-1 text-grey/500",
                        response.status == UpdateResponseStatus.Complete
                          ? "text-grey/400"
                          : "text-grey/500"
                      )}
                      text={`${index + 1}. ${question}`}
                    />
                    <Typography
                      variant="paragraph3"
                      className={
                        response.status == UpdateResponseStatus.Complete
                          ? "text-grey/350"
                          : "text-grey/400"
                      }
                      text={
                        response.answer[index] ? response.answer[index] : "-"
                      }
                    />
                  </div>
                );
              })
            ) : (
              "No response"
            )
          ) : checkTime(response.update.time) == "AddUpdates" ? (
            <div className="h-[calc(100%-60px)]">
              <AddUpdates responseId={response.id} />
            </div>
          ) : (
            <div className="h-[calc(100%-60px)]">
              <Scheduled time={get12hr(response.update.time)} />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const AddUpdates = ({ responseId }: { responseId: string }) => {
  const [leaveSheetOpen, setLeaveSheetOpen] = useState(false);
  const { setCurrentUpdateRespone, currentUpdateResponse } = useUserStore();
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <Typography
        text={`Standup!`}
        variant="display4"
        className="text-grey/500"
      />
      <Typography
        text={`Add your current updates by answering the questions asked`}
        variant="paragraph3"
        className="text-grey/400 mt-2 text-center"
      />

      <Sheet
        open={leaveSheetOpen}
        onOpenChange={(value) => {
          setLeaveSheetOpen(value);
          setCurrentUpdateRespone(responseId);
        }}
      >
        <SheetTrigger className="py-3 px-[18px] gap-[6px] flex items-center justify-center mt-6 rounded-[8px] border-main-400 bg-main-400 shadow-sm text-dark">
          <PlusCircle size={20} />
          <Typography
            text="Add your updates"
            variant="paragraph2"
            className="font-semibold"
          />
        </SheetTrigger>
        <UpdateForm
          currentUpdateResponse={
            currentUpdateResponse ?? ({} as CustomUpdateResponse)
          }
          leaveSheetOpen={leaveSheetOpen}
          setLeaveSheetOpen={setLeaveSheetOpen}
        />
      </Sheet>
    </div>
  );
};

const Scheduled = ({ time }: { time: string }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <Typography
        text={`Scheduled for ${time}`}
        variant="heading1"
        className="text-grey/400"
      />
      <Typography
        text={`This update taker will be available at ${time}`}
        variant="paragraph3"
        className="text-grey/350 mt-2"
      />
    </div>
  );
};

export default UpdateCard;
