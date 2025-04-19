import React, { useMemo, useState } from "react";
import Typography from "../Typography";
import { cn } from "@/lib/utils";
import useUserStore from "@/store/user";
import useAppStore from "@/store/app";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { NotificationType, UpdateResponse } from "@prisma/client";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import useLeaveStore from "@/store/leave";
import useTeamStore from "@/store/team";
import NotificationCard from "./NotificationCard";

dayjs.extend(utc);
dayjs.extend(timezone);

// Extend Day.js with relativeTime plugin
dayjs.extend(relativeTime);

const Notifications = () => {
  const { user, notifications } = useUserStore();
  const { leaveRecords } = useLeaveStore();
  const { upcomingHoliday, onLeaveTomorrow, onLeaveToday } = useAppStore();
  const { teams } = useTeamStore();
  const [activeTab, setActiveTab] = useState(0);

  const renderNotification = useMemo(() => {
    if (!notifications) return [];
    let [holiday, leaveTomorrow, updatesFrequency] = [false, false, false];
    const currentTime = dayjs();

    if (notifications.length == 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const items: any[] = [];
      if (currentTime.hour() >= 9) {
        if (holiday) return items;

        holiday = true;

        items.unshift(
          upcomingHoliday?.map((holiday) => ({
            ...holiday,
            type: NotificationType.Holiday,
            createdAt: dayjs()
              .tz("Asia/Kolkata")
              .hour(9)
              .minute(0)
              .second(0)
              .format(),
          }))
        );
      }

      if (currentTime.hour() >= 12) {
        if (leaveTomorrow) return items;

        leaveTomorrow = true;

        items.unshift(
          (user?.role == "Administrator" ? onLeaveTomorrow : onLeaveToday)?.map(
            (leave) => ({
              ...leave,
              type:
                user?.role == "Administrator"
                  ? NotificationType.LeaveTomorrow
                  : NotificationType.LeaveToday,
              createdAt: dayjs()
                .tz("Asia/Kolkata")
                .hour(12)
                .minute(0)
                .second(0)
                .format(),
            })
          )
        );
      }

      if (currentTime.hour() >= 12) {
        if (updatesFrequency) return items;

        updatesFrequency = true;

        const members: { id: string; name: string; team: string }[] = [];

        teams?.forEach((team) => {
          team.members.forEach((mem) => {
            const frequency = getUpdateFrequency(mem.updateResponse ?? []);

            if (frequency < 10 && !members.some((m) => m.id == mem.id))
              members.push({ id: mem.id, name: mem.name, team: team.name });
          });
        });

        // items.unshift()
      }
      return items;
    } else
      return notifications
        .sort(
          (a, b) => dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf()
        ) // Sort by latest first
        .flatMap((notification) => {
          // const createdAt = dayjs(notification.createdAt);

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const items: any[] = [notification]; // Store notification

          // if (10 >= 9) {
          if ((upcomingHoliday?.length ?? 0) > 0 && currentTime.hour() >= 9) {
            if (holiday) return items;

            holiday = true;

            items.unshift(
              upcomingHoliday?.map((holiday) => ({
                ...holiday,
                type: NotificationType.Holiday,
                createdAt: dayjs()
                  .tz("Asia/Kolkata")
                  .hour(9)
                  .minute(0)
                  .second(0)
                  .format(),
              }))
            );
          }

          // if (14 >= 12) {
          if (
            (user?.role == "Administrator"
              ? (onLeaveTomorrow?.length ?? 0) > 0
              : (onLeaveToday?.length ?? 0) > 0) &&
            currentTime.hour() >= 12
          ) {
            if (leaveTomorrow) return items;

            leaveTomorrow = true;

            items.unshift(
              (user?.role == "Administrator"
                ? onLeaveTomorrow
                : onLeaveToday
              )?.map((leave) => ({
                ...leave,
                type:
                  user?.role == "Administrator"
                    ? NotificationType.LeaveTomorrow
                    : NotificationType.LeaveToday,
                createdAt: dayjs()
                  .tz("Asia/Kolkata")
                  .hour(12)
                  .minute(0)
                  .second(0)
                  .format(),
              }))
            );
          }

          if (currentTime.hour() >= 12) {
            if (updatesFrequency) return items;

            updatesFrequency = true;

            const members: { id: string; name: string; team: string }[] = [];

            teams?.forEach((team) => {
              team.members.forEach((mem) => {
                const frequency = getUpdateFrequency(mem.updateResponse ?? []);

                if (frequency < 10 && !members.some((m) => m.id == mem.id))
                  members.push({ id: mem.id, name: mem.name, team: team.name });
              });
            });

            // items.unshift()
          }
          return items;
        })
        .filter(Boolean)
        .sort((a, b) =>
          Array.isArray(a) && Array.isArray(b)
            ? dayjs(b[0]?.createdAt).valueOf() -
              dayjs(a[0]?.createdAt).valueOf()
            : Array.isArray(a)
            ? dayjs(b?.createdAt).valueOf() - dayjs(a[0]?.createdAt).valueOf()
            : Array.isArray(b)
            ? dayjs(b[0]?.createdAt).valueOf() - dayjs(a?.createdAt).valueOf()
            : dayjs(b?.createdAt).valueOf() - dayjs(a?.createdAt).valueOf()
        );
  }, [
    notifications,
    upcomingHoliday,
    onLeaveTomorrow,
    onLeaveToday,
    teams,
    user,
  ]);

  const tabs = useMemo(() => {
    if (user?.role == "Administrator")
      return ["All notification", "Team leaves", "My leaves"];
    return ["All notification", "My leaves"];
  }, [user]);

  return (
    <div className="flex-1 flex flex-col overflow-y-hidden">
      {/* Navigation */}
      <div className="py-3 mt-4 sticky top-0 left-0">
        <div className="p-[6px] bg-[#F9FAFB] rounded-[10px] flex gap-2 border border-[#EAECF0]">
          {tabs.map((tab, index) => {
            return (
              <div key={index} onClick={() => setActiveTab(index)}>
                <Typography
                  variant="paragraph3"
                  className={cn(
                    "whitespace-nowrap py-[10px] px-3 rounded-[8px] cursor-pointer shadow",
                    activeTab == index
                      ? "text-grey/500 bg-white font-semibold"
                      : "text-gray-500 font-medium shadow-transparent"
                  )}
                  text={tab}
                />
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {renderNotification
          .filter((not) => {
            return activeTab == 0
              ? true
              : tabs[activeTab] == "My leaves"
              ? leaveRecords?.find((rec) => rec.id == not.leaveRecordId)
              : not.type == NotificationType.Leave;
          })
          .map((notification, index) => (
            <NotificationCard data={notification} key={index} />
          ))}
      </div>
    </div>
  );
};

export default Notifications;

const getUpdateFrequency = (response: UpdateResponse[]) => {
  const { complete, incomplete } = response.reduce(
    (acc, data) => {
      if (data.status == "Complete")
        return { ...acc, complete: acc.complete + 1 };
      else if (data.status == "Incomplete")
        return { ...acc, incomplete: acc.incomplete + 1 };

      return acc;
    },
    { complete: 0, incomplete: 0 }
  );

  return complete + incomplete != 0
    ? (complete * 100) / (complete + incomplete)
    : 0;
};
