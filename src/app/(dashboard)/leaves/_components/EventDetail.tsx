import useCalendarStore from "@/store/calendar";
import React, { Dispatch, SetStateAction, useMemo } from "react";
import { renderStringWithEmoji } from "../../settings/leave-policy/_components/LeavePolicyTable";
import Typography from "../../_components/Typography";
import dayjs from "dayjs";
import { LeaveStatus } from "@prisma/client";
import useUserStore from "@/store/user";
import useLeaveStore from "@/store/leave";
import { toastFullfilled, toastPending } from "../../_components/Toast";
import { getDeducted } from "@/utils/helpers/getDeductes";
import { cn } from "@/lib/utils";
import isBetween from "dayjs/plugin/isBetween";
import { EventType } from "@types";
import {
  getDate,
  getTime,
} from "../../_components/notification/NotificationCard";

dayjs.extend(isBetween);

const EventDetail = ({
  setOpen,
  fromNotification = false,
}: {
  setOpen: Dispatch<SetStateAction<boolean>>;
  fromNotification?: boolean;
}) => {
  const { activeEvent, events } = useCalendarStore();
  const { user } = useUserStore();
  const { cancelLeave, rejectLeave, approveLeave } = useLeaveStore();

  const collapsingLeaves = useMemo(() => {
    if (!activeEvent) return [];

    return events
      .filter((event) => {
        // Check if there's an overlap in date range
        if (
          event.type == ("HOLIDAY" as unknown as EventType.HOLIDAY) ||
          event.id == activeEvent.id ||
          event.status == LeaveStatus.REJECTED
        )
          return false;

        const [eventStart, eventEnd, activeStart, activeEnd] = [
          dayjs(event.start),
          dayjs(event.end ?? event.start),
          dayjs(activeEvent.start),
          dayjs(activeEvent.end ?? activeEvent.start),
        ];

        if (
          activeStart.isBetween(eventStart, eventEnd, "date", "[]") ||
          activeEnd.isBetween(eventStart, eventEnd, "date", "[]") ||
          eventStart.isBetween(activeStart, activeEnd, "date", "[]") ||
          eventEnd.isBetween(activeStart, activeEnd, "date", "[]")
        )
          return true;

        return false;
      })
      .map(
        (event) =>
          `${event.name} (${getDate(event.start)}-${getTime(
            event.startTime ?? ""
          )}${
            event.end
              ? ` | ${getDate(event.end)}-${getTime(event.endTime ?? "")}`
              : ""
          })`
      )
      .join("\n"); // Use <br/> instead of \n
  }, [activeEvent, events]);

  const details = useMemo(() => {
    if (!activeEvent) return;

    const getLeaveTime = (time: string | null | undefined) => {
      if (time == "SECOND_HALF") return "2nd half";
      else if (time == "FIRST_HALF") return "1st half";
      else return "Full day";
    };

    const isEndValid =
      dayjs(activeEvent.end, "YYYY-MM-DD").isValid() &&
      !dayjs(activeEvent.start, "YYYY-MM-DD").isSame(
        dayjs(activeEvent.end, "YYYY-MM-DD")
      );
    const [sdLabel, stLabel] = [
      isEndValid ? "Start date" : "Date",
      isEndValid ? "Start time" : "Time",
    ];

    return {
      ...(fromNotification && { Status: activeEvent.status }),
      Name: activeEvent.name,
      Team: activeEvent.teams?.join(", "),
      "Leave type": renderStringWithEmoji(activeEvent.leaveName),
      [sdLabel]: dayjs(activeEvent.start).format("ddd, DD MMM, YYYY"),
      [stLabel]: getLeaveTime(activeEvent.startTime),
      ...(isEndValid && {
        "End date": dayjs(
          activeEvent.end ? activeEvent.end : activeEvent.start
        ).format("ddd, DD MMM, YYYY"),
        "End time": getLeaveTime(activeEvent.endTime),
      }),
      ...(user?.role == "Administrator" && {
        Reason: activeEvent.reason || "No reason",
      }),
      "Leave Collapsing": collapsingLeaves,
      Approver: activeEvent.approver,
      ...(!fromNotification &&
        user?.role == "Administrator" &&
        activeEvent.status == "PENDING" && {
          "Days deducted":
            getDeducted(
              dayjs(activeEvent.start).format("MMM D"),
              dayjs(activeEvent.end).format("MMM D"),
              activeEvent.startTime,
              activeEvent.endTime,
              dayjs(activeEvent.end).isValid()
            ).toString() + " days",
        }),
      ...(fromNotification && {
        "Days will deduct":
          getDeducted(
            dayjs(activeEvent.start, "YYYY-MM-DD").format("MMM D"),
            dayjs(activeEvent.end, "YYYY-MM-DD").format("MMM D"),
            activeEvent.startTime,
            activeEvent.endTime,
            dayjs(activeEvent.end).isValid()
          ) + " days",
      }),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeEvent]);

  const [isOwner, isAdmin, isPending, isUserLeave] = useMemo(() => {
    return [
      user?.role == "Owner",
      user?.role == "Administrator",
      activeEvent?.status == LeaveStatus.PENDING,
      activeEvent?.userId == user?.id,
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeEvent]);

  const handleCancelLeave = async () => {
    const toastId = toastPending("Cancelling leave...");
    const res = await cancelLeave(activeEvent?.id ?? "");

    toastFullfilled(
      toastId,
      res,
      "Leave cancelled successfully!",
      "Error cancelling leave!",
      setOpen
    );
  };

  const handleApproveLeave = async () => {
    const toastId = toastPending("Approving leave...");
    const res = await approveLeave(activeEvent?.id ?? "");

    toastFullfilled(
      toastId,
      res,
      "Leave approved successfully!",
      "Error approving leave",
      setOpen
    );
  };

  const handleRejectLeave = async () => {
    const toastId = toastPending("Rejecting leave...");
    const res = await rejectLeave(activeEvent?.id ?? "");

    toastFullfilled(
      toastId,
      res,
      "Leave rejected successfully!",
      "Error rejecting leave",
      setOpen
    );
  };

  return (
    <div className="py-8 px-6 flex flex-col gap-3 flex-1">
      {details &&
        Object.entries(details).map(([key, value], index) => {
          return (
            <div key={index}>
              {(fromNotification
                ? [1, 4, 8, 9]
                : isAdmin && isPending
                ? [3, 7, 8]
                : [3, 7]
              ).includes(index) && (
                <hr className="w-full h-1 my-1" key={`hr-${index}`} />
              )}

              {isAdmin &&
              key == "Approver" &&
              isPending &&
              !fromNotification ? (
                <Typography
                  key={index}
                  text={"Approval Pending"}
                  className="font-semibold text-error-400"
                  variant="paragraph2"
                />
              ) : (
                <div
                  key={`detail-${index}`} // Ensure uniqueness
                  className={cn(
                    "flex justify-between w-full items-start gap-3",
                    fromNotification &&
                      key == "Reason" &&
                      "flex-col justify-start items-start"
                  )}
                >
                  <Typography
                    text={key}
                    className="font-semibold text-grey/400"
                    variant="paragraph2"
                  />
                  {fromNotification && key == "Status" ? (
                    value == LeaveStatus.PENDING ? (
                      <Typography
                        variant="label"
                        className="bg-[#FBEBDA] text-[#E78823] py-1 px-3 rounded-[16px] border border-[#E78823]"
                      >
                        {user?.role == "Administrator"
                          ? `Pending approval from
                        ${activeEvent?.approver.split(" ")[0]}`
                          : "Request Submitted"}
                      </Typography>
                    ) : value == LeaveStatus.APPROVED ? (
                      <Typography
                        variant="label"
                        className="bg-[#E1F4F0] text-[#44BBA4] py-1 px-3 rounded-[16px] border border-[#44BBA4]"
                      >
                        {user?.role == "Administrator"
                          ? `Approved by
                        ${activeEvent?.approver.split(" ")[0]}`
                          : "Approved"}
                      </Typography>
                    ) : (
                      <Typography
                        variant="label"
                        className="bg-[#F4E1E2] text-[#BC4B51] py-1 px-3 rounded-[16px] border border-[#BC4B51]"
                      >
                        {user?.role == "Administrator"
                          ? `Rejected by
                        ${activeEvent?.approver.split(" ")[0]}`
                          : "Rejected"}
                      </Typography>
                    )
                  ) : (
                    <Typography
                      text={value?.toString()}
                      className="font-semibold text-grey/500 whitespace-pre text-end"
                      variant="paragraph2"
                    />
                  )}
                </div>
              )}
            </div>
          );
        })}

      <div className="flex-grow"></div>

      <div>
        {!isUserLeave && (isOwner || isAdmin) && isPending ? (
          <div className="flex gap-6 items-center min-w-full">
            <button
              onClick={handleRejectLeave}
              className="w-full focus:outline-none border bg-error-400 border-error-400 rounded-[8px] shadow text-white font-semibold py-3 px-[18px]"
            >
              Reject
            </button>
            <button
              onClick={handleApproveLeave}
              className="w-full focus:outline-none border bg-secondary-400 border-secondary-400-main rounded-[8px] shadow text-main-400 font-semibold py-3 px-[18px]"
            >
              Approve
            </button>
          </div>
        ) : isUserLeave &&
          dayjs(activeEvent?.start, "YYYY-MM-DD").isAfter(dayjs()) ? (
          <div className="flex justify-between">
            <div className=""></div>
            <button
              onClick={handleCancelLeave}
              className="px-[18px] py-3 focus:outline-none  rounded-[8px] shadow border border-[#C84C09] text-error-600 font-semibold ml-auto"
            >
              Delete Leave Request
            </button>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default EventDetail;
