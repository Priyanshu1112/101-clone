import { UserCircleBg } from "@/assets/UserCircle";
import { calendarCodes } from "@/utils/constant/calendarCodes";
import { LeaveStatus, NotificationType } from "@prisma/client";
import Typography from "../Typography";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import useCalendarStore from "@/store/calendar";
import { renderStringWithEmoji } from "../../settings/leave-policy/_components/LeavePolicyTable";
import { Button } from "@/components/ui/button";
import useLeaveStore from "@/store/leave";
import { toastFullfilled, toastPending } from "../Toast";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import Umbrealla03 from "@/assets/Umbrealla03";
import CalendarMinus from "@/assets/CalendarMinus";
import { toWords } from "number-to-words";
import useTeamStore from "@/store/team";
import { UpdatesFrequency } from "@/assets/MessageTextCircle";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import UpdateForm from "../../updates/_components/UpdateForm";
import useUserStore, { CustomUpdateResponse } from "@/store/user";
import { useState } from "react";
import { ChevronRight } from "lucide-react";
import EventDetail from "../../leaves/_components/EventDetail";
import UserCheck from "@/assets/UserCheck";

dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.extend(relativeTime);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const NotificationCard = ({ data }: { data: any }) => {
  const { events, setActiveEvent } = useCalendarStore();
  const { teams, teamUser } = useTeamStore();
  const { rejectLeave, approveLeave, leaveRecords } = useLeaveStore();
  const {
    setCurrentUpdateRespone,
    currentUpdateResponse,
    updateResponse,
    user,
  } = useUserStore();

  const [leaveSheetOpen, setLeaveSheetOpen] = useState(false);
  const [eventSheetOpen, setEventSheetOpen] = useState(false);

  const getTeamName = (userId) => {
    const teamIds = teamUser
      ?.filter((team) => team.userId == userId)
      .map((data) => data.teamId);

    return (
      teams
        ?.filter((team) => teamIds?.includes(team.id))
        .map((data) => data.name) ?? []
    );
  };

  const handleApproveLeave = async (leaveId) => {
    const toastId = toastPending("Approving leave...");
    const res = await approveLeave(leaveId ?? "");

    toastFullfilled(
      toastId,
      res,
      "Leave approved successfully!",
      "Error approving leave"
    );
  };

  const handleRejectLeave = async (leaveId) => {
    const toastId = toastPending("Rejecting leave...");
    const res = await rejectLeave(leaveId ?? "");

    toastFullfilled(
      toastId,
      res,
      "Leave rejected successfully!",
      "Error rejecting leave"
    );
  };

  if (data?.type == NotificationType.Leave) {
    const text = JSON.parse(data.text);
    const leave = events.find((event) => event.id == data.leaveRecordId);
    const self = !!leaveRecords?.find((record) => record.id == leave?.id);

    const isDeleted = data.title.includes("deleted");
    const isDeletedLeave = !data.leaveRecordId && data.leaveStatus;

    if (!leave && !isDeletedLeave && !isDeleted) return <></>;

    return (
      <div className="relative flex px-5 py-6 gap-3 border-t last:border-b">
        <div>
          {isDeleted && !isDeletedLeave ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
            >
              <path
                d="M18.6667 7.00004V6.06671C18.6667 4.75992 18.6667 4.10652 18.4123 3.6074C18.1886 3.16835 17.8317 2.8114 17.3926 2.58769C16.8935 2.33337 16.2401 2.33337 14.9333 2.33337H13.0667C11.7599 2.33337 11.1065 2.33337 10.6074 2.58769C10.1683 2.8114 9.81136 3.16835 9.58765 3.6074C9.33333 4.10652 9.33333 4.75992 9.33333 6.06671V7.00004M11.6667 13.4167V19.25M16.3333 13.4167V19.25M3.5 7.00004H24.5M22.1667 7.00004V20.0667C22.1667 22.0269 22.1667 23.007 21.7852 23.7557C21.4496 24.4142 20.9142 24.9497 20.2556 25.2852C19.5069 25.6667 18.5268 25.6667 16.5667 25.6667H11.4333C9.47315 25.6667 8.49306 25.6667 7.74437 25.2852C7.0858 24.9497 6.55037 24.4142 6.21481 23.7557C5.83333 23.007 5.83333 22.0269 5.83333 20.0667V7.00004"
                stroke="#7C878D"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : data?.leaveStatus == LeaveStatus.PENDING ? (
            <UserCircleBg size={40} code={calendarCodes[0]} />
          ) : data?.leaveStatus == LeaveStatus.APPROVED ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
            >
              <path
                d="M10.1309 16L14.044 19.9131L21.8701 12.087M29.044 16C29.044 23.2037 23.2042 29.0435 16.0005 29.0435C8.79679 29.0435 2.95703 23.2037 2.95703 16C2.95703 8.79631 8.79679 2.95654 16.0005 2.95654C23.2042 2.95654 29.044 8.79631 29.044 16Z"
                stroke="#44BBA4"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
            >
              <path
                d="M19.9136 12.087L12.0875 19.9131M12.0875 12.087L19.9136 19.9131M29.044 16C29.044 23.2037 23.2042 29.0435 16.0005 29.0435C8.79679 29.0435 2.95703 23.2037 2.95703 16C2.95703 8.79631 8.79679 2.95654 16.0005 2.95654C23.2042 2.95654 29.044 8.79631 29.044 16Z"
                stroke="#BC4B51"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>

        <div className="w-full">
          <div className="flex gap-2 items-center w-full">
            <div className="flex-1">
              <Typography
                text={
                  user?.role == "Administrator"
                    ? data.title
                    : self
                    ? data.title.split(" ").slice(0, 2).join(" ")
                    : data.title
                }
                variant="paragraph2"
                className="font-medium text-grey/500"
              />
              <Typography
                text={dayjs(data.createdAt).tz("Asia/Kolkata").fromNow()}
                variant="label"
                className="text-grey/400"
              />
            </div>
            {!isDeleted && !isDeletedLeave && (
              <div>
                <button
                  onClick={() => {
                    setActiveEvent(data.leaveRecordId);
                    setEventSheetOpen(true);
                  }}
                >
                  <ChevronRight size={20} className="text-gray-500" />
                </button>
              </div>
            )}
          </div>
          <div className="mt-2 mb-3 rounded-[8px] py-2 px-3 bg-[#f2f4f780]">
            <Typography variant="paragraph3" className="text-grey/400">
              Date: {getDate(text?.start ?? "")} (
              {getTime(text?.startTime ?? "")})
              {text?.end &&
                `- ${getDate(text.end)} (${getTime(text.endTime ?? "")})`}
            </Typography>
            <Typography variant="paragraph3" className="text-grey/400">
              Type: {renderStringWithEmoji(text?.name)}
            </Typography>
            <Typography variant="paragraph3" className="text-grey/400">
              Reason: {text?.reason || "Not given"}
            </Typography>
          </div>
          {leave?.status == "PENDING" &&
            !leaveRecords?.find((lr) => lr.id == leave.id) && (
              <div className="flex gap-3">
                <Button
                  size={"sm"}
                  variant={"outline"}
                  className="text-error-300 border-error-300 hover:text-error-300"
                  onClick={() => handleRejectLeave(leave.id)}
                >
                  Reject
                </Button>
                <Button
                  size={"sm"}
                  className="bg-secondary-400-main text-main-400 hover:text-main-400"
                  onClick={() => handleApproveLeave(leave.id)}
                >
                  Approve
                </Button>
              </div>
            )}
        </div>

        <Sheet open={eventSheetOpen} onOpenChange={(e) => setEventSheetOpen(e)}>
          <SheetContent className="p-0 min-w-fit flex flex-col">
            <SheetTitle className="py-4 px-6 border-gray-300 border-b">
              <Typography variant="display4" text={"Leave details"} />
            </SheetTitle>
            <EventDetail setOpen={setEventSheetOpen} fromNotification={true} />
          </SheetContent>
        </Sheet>
      </div>
    );
  }

  if (data?.type == NotificationType.UpdateReminder) {
    return (
      <div className="relative flex px-5 py-6 gap-3 border-t last:border-b">
        <div>
          <UpdatesFrequency />
        </div>
        <div>
          <div>
            <Typography
              text={data.title}
              variant="paragraph2"
              className="font-medium text-grey/500"
            />
            <Typography
              text={dayjs(data.createdAt).tz("Asia/Kolkata").fromNow()}
              variant="label"
              className="text-grey/400"
            />
          </div>
          <Typography variant="paragraph3" className="text-gray-400">
            {data.text}
          </Typography>

          {updateResponse?.find((res) => res.id == data.updateResponseId)
            ?.status == "Scheduled" && (
            <Sheet
              open={leaveSheetOpen}
              onOpenChange={(value) => {
                setLeaveSheetOpen(value);
                setCurrentUpdateRespone(data.updateResponseId);
              }}
            >
              <SheetTrigger asChild>
                <Button
                  size={"sm"}
                  className="bg-secondary-400-main text-main-400 hover:text-main-400 mt-2"
                >
                  Add your updates
                </Button>
              </SheetTrigger>
              <UpdateForm
                currentUpdateResponse={
                  currentUpdateResponse ?? ({} as CustomUpdateResponse)
                }
                leaveSheetOpen={leaveSheetOpen}
                setLeaveSheetOpen={setLeaveSheetOpen}
              />
            </Sheet>
          )}
        </div>
      </div>
    );
  }

  if (Array.isArray(data)) {
    if (data.some((d) => d.type == NotificationType.Holiday)) {
      return (
        <div className="relative flex px-5 py-6 gap-3 border-t last:border-b">
          <div>
            <Umbrealla03 />
          </div>
          <div>
            <div>
              <Typography
                text={"Hurray! Public holiday coming"}
                variant="paragraph2"
                className="font-medium text-grey/500"
              />
              <Typography
                text={dayjs(data[0].createdAt).tz("Asia/Kolkata").fromNow()}
                variant="label"
                className="text-grey/400"
              />
            </div>
            <Typography variant="paragraph3" className="text-gray-400">
              There is {toWords(data.length)} public holiday coming your way in
              the next weeks for team of{" "}
              {holidayFromData(
                data.map((d) => ({
                  name: d.team.name,
                  holiday: d.holiday.map((h) => ({
                    occasion: h.occasion,
                    date: h.date,
                  })),
                }))
              )}{" "}
            </Typography>
          </div>
        </div>
      );
    }

    if (
      data.some((d) =>
        [NotificationType.LeaveTomorrow, NotificationType.LeaveToday].includes(
          d.type
        )
      )
    ) {
      const userTeams = data.reduce((acc, leave) => {
        return [
          ...acc,
          {
            id: leave.userId,
            name: leave?.name,
            teamName: textFromArray(getTeamName(leave.userId)),
          },
        ];
      }, []);

      return (
        <div className="relative flex px-5 py-6 gap-3 border-t last:border-b">
          <div>
            <CalendarMinus />
          </div>
          <div>
            <div>
              <Typography
                text={
                  (data.length == 1
                    ? "1 member is on leave "
                    : data.length + " members are on leave ") +
                  (user?.role == "Administrator" ? "tomorrow" : "today")
                }
                variant="paragraph2"
                className="font-medium text-grey/500"
              />
              <Typography
                text={dayjs(data[0].createdAt).tz("Asia/Kolkata").fromNow()}
                variant="label"
                className="text-grey/400"
              />
            </div>
            <Typography variant="paragraph3" className="text-gray-400">
              {textFromArray(userTeams.map((team) => team.name))}{" "}
              {userTeams.length > 1 ? "are" : "is"} on leave tomorrow from your{" "}
              {textFromArray(userTeams.map((team) => team.teamName))}.
            </Typography>
          </div>
        </div>
      );
    }
  }

  if (data?.type == NotificationType.Onboard)
    return (
      <div className="relative flex px-5 py-6 gap-3 border-t last:border-b">
        <div>
          <UserCheck />
        </div>
        <div>
          <div>
            <Typography
              text={data.title}
              variant="paragraph2"
              className="font-medium text-grey/500"
            />
            <Typography
              text={dayjs(data.createdAt).tz("Asia/Kolkata").fromNow()}
              variant="label"
              className="text-grey/400"
            />
          </div>
          <Typography variant="paragraph3" className="text-gray-400">
            {data.text}
          </Typography>
        </div>
      </div>
    );

  return "";
};

export default NotificationCard;

export const getDate = (date: string) => {
  return dayjs(date, "YYYY-MM-DD").format("MMM D");
};

export const getTime = (time: string) => {
  return time == "FULL_DAY"
    ? "Full day"
    : time == "FIRST_HALF"
    ? "1st half"
    : "2nd half";
};

const holidayFromData = (
  arr: { name: string; holiday: { occasion: string; date: string }[] }[]
) => {
  if (arr.length === 0) return "";

  if (arr.length === 1) {
    const { name, holiday } = arr[0];
    if (holiday.length === 1) {
      return `${name} for ${holiday[0].occasion} (${dayjs(
        holiday[0].date,
        "MMM D"
      )
        .year(dayjs().year())
        .format("ddd, D MMM YYYY")})`;
    }
    const holidayNames = holiday.map(
      (h) =>
        `${h.occasion} (${dayjs(h.date, "MMM D")
          .year(dayjs().year())
          .format("ddd, D MMM YYYY")})`
    );
    return `${name} for ${holidayNames.slice(0, -1).join(", ")} and ${
      holidayNames[holidayNames.length - 1]
    }`;
  }

  const names = arr.map((item) => item.name);
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
};

const textFromArray = (arr: string[]) => {
  return arr.length === 1
    ? arr[0]
    : arr.slice(0, -1).join(", ") + " and " + arr[arr.length - 1];
};
