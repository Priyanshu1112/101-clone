"use client";

import useUserStore from "@/store/user";
import Navigation from "./_components/Navigation";
import { SessionProvider } from "next-auth/react";
import { useEffect, useMemo } from "react";
import CheckSession from "./_components/CheckSession";
import useTeamStore from "@/store/team";
import useCalendarStore from "@/store/calendar";
import useLeaveStore from "@/store/leave";
import useWorkdayStore from "@/store/workday";
import useAppStore from "@/store/app";
import supabase from "@/service/supabase";
import useUpdateStore from "@/store/update";
import dayjs from "dayjs";
import { EventType } from "@types";
import isBetween from "dayjs/plugin/isBetween";
import { LeaveStatus } from "@prisma/client";

dayjs.extend(isBetween);

export default function Layout({ children }: { children: React.ReactNode }) {
  const {
    getSession,
    company,
    getLeaveDetail,
    user,
    teams,
    getUpdateResponse,
    updateURRL,
    insertURRL,
    addNotification,
    deleteNotifications,
    upateNotifications,
  } = useUserStore();
  const { setTeams, fetchTeamUser, teams: allTeams } = useTeamStore();
  const {
    fetchEvents,
    getLeaveDetails,
    fetchCalendar,
    calendar,
    events,
    insertEvent,
    updateEvent,
    deleteEvent,
  } = useCalendarStore();
  const { getLeavePolicy, getLeaveRecords } = useLeaveStore();
  const { getWorkday } = useWorkdayStore();
  const { getAllUsers, setLeaveTomorrow, setUpcomingHoliday, setLeaveToday } =
    useAppStore();
  const { getUpdates } = useUpdateStore();

  const upcomingHoliday = useMemo(() => {
    const today = dayjs();
    const end = today.add(7, "day");

    return calendar
      ?.map((cal) => ({
        ...cal,
        holiday: cal.holiday?.filter((hol) => {
          return dayjs(
            hol.date + " " + today.get("year"),
            "MMM D YYYY"
          ).isBetween(today, end, "day", "[]");
        }),
      }))
      .filter((cal) => cal.holiday?.length > 0); // Remove calendar objects with no holidays
  }, [calendar]);

  const onLeaveTomorrow = useMemo(() => {
    const tomorrow = dayjs().add(1, "day");
    return events.filter((event) =>
      event.type == ("LEAVE" as unknown as EventType) &&
      event.status != LeaveStatus.REJECTED
        ? event.end
          ? tomorrow.isBetween(
              dayjs(event.start, "YYYY-MM-DD"),
              dayjs(event.end ?? event.start, "YYYY-MM-DD"),
              "day",
              "[]"
            )
          : event.date == tomorrow.format("YYYY-MM-DD")
        : false
    );
  }, [events]);

  const onLeaveToday = useMemo(() => {
    const tomorrow = dayjs();
    return events.filter((event) =>
      event.type == ("LEAVE" as unknown as EventType) && event.end
        ? tomorrow.isBetween(
            dayjs(event.start, "YYYY-MM-DD"),
            dayjs(event.end ?? event.start, "YYYY-MM-DD"),
            "day",
            "[]"
          )
        : event.date == tomorrow.format("YYYY-MM-DD")
    );
  }, [events]);

  useEffect(() => {
    if (upcomingHoliday) setUpcomingHoliday(upcomingHoliday);

    if (onLeaveTomorrow) setLeaveTomorrow(onLeaveTomorrow);

    if (onLeaveToday) setLeaveToday(onLeaveToday);
  }, [
    upcomingHoliday,
    onLeaveTomorrow,
    setUpcomingHoliday,
    setLeaveTomorrow,
    onLeaveToday,
    setLeaveToday,
  ]);

  const checkForTable = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payload: any
  ) => {
    if (payload.table == "Notification") {
      if (payload.eventType == "DELETE") deleteNotifications(payload.old);
      else if (payload.eventType == "INSERT") addNotification(payload.new);
      else if (payload.eventType == "UPDATE") upateNotifications(payload.new);
    } else if ((payload.table = "LeaveRecord")) {
      if (payload.eventType == "UPDATE") {
        updateEvent(payload);
      } else if (payload.eventType == "INSERT") {
        console.log(payload.new.userId != user?.id);
        // if (payload.new.userId != user?.id)
        insertEvent(payload);
      } else if (payload.eventType == "DELETE") {
        console.log(payload.new.userId != user?.id);
        // if (payload.new.userId != user?.id)
        deleteEvent(payload);
      }
    } else {
      if (payload.new.userId == user?.id) {
        if (payload.eventType == "UPDATE") updateURRL(payload.new);
        else if (payload.eventType == "INSERT") insertURRL(payload.new);
      }
    }
  };

  useEffect(() => {
    let channel;
    if (user) {
      channel = supabase
        .channel("realtime-supabase")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "*",
          },
          (payload) => {
            console.log("Received payload:", payload);
            checkForTable(payload);
          }
        )
        .subscribe();
    }

    // Clean up on unmount
    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    getSession();

    if (company && user && teams) {
      setTeams(company.id);
      getLeaveDetail(company.id, user?.id ?? "");
      fetchEvents(company.id, user?.id ?? "");
      getLeavePolicy(company.id ?? "");
      getLeaveDetails(user.id);
      getWorkday(teams);
      getAllUsers(company.id);
      getUpdateResponse(user.id);
      getUpdates(company.id);
      fetchCalendar(company.id);
      getLeaveRecords(user.id);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getSession, company, teams]);

  useEffect(() => {
    if (allTeams) fetchTeamUser();
  }, [allTeams, fetchTeamUser]);

  return (
    <div>
      <SessionProvider>
        <CheckSession>
          <Navigation />
          <main className="px-20 pt-7 pb-1">{children}</main>
        </CheckSession>
      </SessionProvider>
    </div>
  );
}
