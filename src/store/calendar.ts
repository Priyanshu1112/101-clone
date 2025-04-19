import dayjs, { Dayjs } from "dayjs";
import { create } from "zustand";
import { Event, EventType } from "@types";
import {
  Calendar,
  Holiday,
  LeaveRecord,
  LeaveStatus,
  Team,
  User,
} from "@prisma/client";
import useLeaveStore, { FetchStatus } from "./leave";
import useUserStore from "./user";
import { addDays, format, subDays, subMonths } from "date-fns";
import useTeamStore from "./team";
import useAppStore from "./app";

export interface CustomTeam extends Team {
  leads: User[];
  assignedTo: number;
}

export interface CustomCalendar extends Calendar {
  holiday: Holiday[];
  team: CustomTeam;
}

export interface ActiveEvent extends Event {
  userId: string;
  teams: string[] | null;
  leaveName: string;
  approver: string;
  status: LeaveStatus;
}

interface CalendarState {
  calendar: CustomCalendar[] | null;
  currentCalendar: CustomCalendar | null;
  currentCalendarStatus: FetchStatus | null;
  holiday: Event[] | null;
  eventsLoading: boolean;
  eventsError: null | Error;
  events: Event[];
  currentDate: Dayjs;
  isMonthlyView: boolean;
  showMyLeaves: boolean;
  hideWeekend: boolean;
  fetchCalendarStatus: FetchStatus | null;
  fetchHolidayStatus: FetchStatus | null;
  createCalendarStatus: FetchStatus | null;
  updateCalendarStatus: FetchStatus | null;
  deleteHolidayStatus: FetchStatus | null;
  addHolidayStatus: FetchStatus | null;
  deleteCalendarStatus: FetchStatus | null;
  leaveDetails: { latestLeave: LeaveRecord; upcomingHoliday: Holiday } | null;
  getLeaveDetailsStatus: FetchStatus | null;
  onlyMyLeaves: boolean;
  activeEvent: ActiveEvent | null;
  setOnlyMyLeaves: (value: boolean) => void;
  reset: () => void;
  setCurrentDate: (date: Dayjs) => void;
  setIsMonthlyView: (view: boolean) => void;
  setShowMyLeaves: (view: boolean) => void;
  setHideWeekend: (view: boolean) => void;
  fetchEvents: (companyId: string, userId: string) => void;
  setActiveEvent: (id: string) => void;
  fetchCalendar: (company: string) => void;
  fetchHoliday: (calendarId: string) => Promise<FetchStatus>;
  resetStatus: () => void;
  addHoliday: (date: Date, occasion: string) => void;
  addHolidayLocal: (date: Date, occasion: string, id?: string | null) => void;
  createCalendar: (country: string) => Promise<FetchStatus>;
  setCurrentCalendar: (calendarId: string) => void;
  updateCalendar: ({
    teamId,
    calendarId,
  }: {
    teamId?: string;
    calendarId?: string;
  }) => Promise<FetchStatus>;
  deleteHoliday: (holidayId: string) => Promise<FetchStatus>;
  deleteHolidayLocal: (holidayId: string) => void;
  deleteCalendar: () => Promise<FetchStatus>;
  getLeaveDetails: (userId: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  insertEvent: (payload: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateEvent: (payload: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deleteEvent: (payload: any) => void;
}

const status = {
  fetchHolidayStatus: null,
  createCalendarStatus: null,
  updateCalendarStatus: null,
  deleteCalendarStatus: null,
  currentCalendarStatus: null,
  fetchCalendarStatus: null,
  deleteHolidayStatus: null,
  addHolidayStatus: null,
  getLeaveDetailsStatus: null,
};

const initialState = {
  eventsLoading: false,
  eventsError: null,
  events: [],
  currentDate: dayjs(),
  isMonthlyView: true,
  showMyLeaves: false,
  hideWeekend: false,
  calendar: null,
  holiday: null,
  currentCalendar: null,
  leaveDetails: null,
  onlyMyLeaves: false,
  activeEvent: null,
  ...status,
};

const useCalendarStore = create<CalendarState>((set, get) => ({
  ...initialState,
  reset: () => set(initialState),
  resetStatus: () => {
    set(status);
  },
  setOnlyMyLeaves(value) {
    set({ onlyMyLeaves: value });
  },
  setCurrentDate: (date) => set({ currentDate: date }),
  setIsMonthlyView: (view) => set({ isMonthlyView: view }),
  setShowMyLeaves: (view) => set({ showMyLeaves: view }),
  setHideWeekend: (view) => set({ hideWeekend: view }),
  fetchEvents: async (companyId, userId) => {
    set({ eventsLoading: true });
    try {
      const response = await fetch(
        `/api/calendar/events/${companyId}/${userId}?year=${new Date().getFullYear()}`
      );

      if (response.ok) {
        const res = await response.json();
        set({ events: res, eventsLoading: false });
      }
    } catch (error: unknown) {
      set({ eventsLoading: false, eventsError: error as Error });
    }
  },
  fetchCalendar: async (companyId) => {
    try {
      set({ fetchCalendarStatus: FetchStatus.PENDING });
      const res = await fetch("/api/calendar/" + companyId);

      if (res.ok) {
        const response = await res.json();
        set({ fetchCalendarStatus: FetchStatus.SUCCESS, calendar: response });
      } else {
        set({ fetchCalendarStatus: FetchStatus.ERROR });
      }
    } catch (error) {
      console.error(error);
      set({ fetchCalendarStatus: FetchStatus.ERROR });
    }
  },
  fetchHoliday: async (calendarId) => {
    try {
      set({ fetchHolidayStatus: FetchStatus.PENDING });
      const encodedCI = encodeURIComponent(calendarId);
      const res = await fetch(`/api/calendar/events/` + encodedCI);
      //   {
      //   method: "POST",
      //   body: JSON.stringify({ calendarId }),
      // });

      if (res.ok) {
        const response = await res.json();
        set({
          fetchHolidayStatus: FetchStatus.SUCCESS,
          holiday: response.events,
        });
        return FetchStatus.SUCCESS;
      } else {
        set({ fetchHolidayStatus: FetchStatus.ERROR });
        return FetchStatus.ERROR;
      }
    } catch (error) {
      console.error(error);
      set({ fetchHolidayStatus: FetchStatus.ERROR });
      return FetchStatus.ERROR;
    }
  },
  addHolidayLocal: (date, occasion, id = null) => {
    const originalDate = new Date("Mon Dec 30 2024 00:00:00 GMT+0530");

    const startDate = subDays(subMonths(originalDate, 1), 1);
    const formattedStart = format(startDate, "yyyy-MM-dd");

    const endDate = addDays(startDate, 1);
    const formattedEnd = format(endDate, "yyyy-MM-dd");

    set((state) => ({
      holiday: [
        ...(state.holiday ?? []),
        {
          ...(id && { id }),
          date: dayjs(date).format("MMM D"),
          occasion,
          type: "HOLIDAY" as unknown as EventType.HOLIDAY,
          start: formattedStart,
          end: formattedEnd,
          name: "",
        },
      ]
        // Sort the holidays after adding the new one
        .sort(
          (a, b) =>
            dayjs(a.date, "MMM D").toDate().getTime() -
            dayjs(b.date, "MMM D").toDate().getTime()
        ),
    }));
  },
  addHoliday: async (date, occasion) => {
    try {
      set({ addHolidayStatus: FetchStatus.PENDING });
      const originalDate = new Date("Mon Dec 30 2024 00:00:00 GMT+0530");

      const startDate = subDays(subMonths(originalDate, 1), 1);
      const formattedStart = format(startDate, "yyyy-MM-dd");

      const endDate = addDays(startDate, 1);
      const formattedEnd = format(endDate, "yyyy-MM-dd");
      const res = await fetch("/api/calendar/holiday", {
        method: "POST",
        body: JSON.stringify({
          date,
          occasion,
          calendarId: get().currentCalendar?.id,
          start: formattedStart,
          end: formattedEnd,
        }),
      });

      if (res.ok) {
        get().addHolidayLocal(date, occasion, (await res.json()).id);
        set({ addHolidayStatus: FetchStatus.SUCCESS });
      } else set({ addHolidayStatus: FetchStatus.ERROR });
    } catch (error) {
      console.error(error);
      set({ addHolidayStatus: FetchStatus.ERROR });
    }
  },
  createCalendar: async (country) => {
    try {
      set({ createCalendarStatus: FetchStatus.PENDING });
      const res = await fetch("/api/calendar", {
        method: "POST",
        body: JSON.stringify({
          calendar: {
            country: country.split("-|-")[0],
            id: country.split("-|-")[1],
          },
          holiday: get().holiday,
          companyId: useUserStore.getState().company?.id,
        }),
      });

      if (res.ok) {
        const response = await res.json();
        if (!response.newCalendar._count) {
          response.newCalendar._count = {};
        }

        response.newCalendar._count.holiday = get().holiday?.length ?? 0;

        set({
          currentCalendar: response.newCalendar,
          calendar: [response.newCalendar, ...(get().calendar ?? [])], // Use nullish coalescing
          createCalendarStatus: FetchStatus.SUCCESS,
        });
        return FetchStatus.SUCCESS;
      } else {
        set({ createCalendarStatus: FetchStatus.ERROR });
        return FetchStatus.ERROR;
      }
    } catch (error) {
      console.error(error);
      set({ createCalendarStatus: FetchStatus.ERROR });
      return FetchStatus.ERROR;
    }
  },
  setCurrentCalendar: async (calendarId) => {
    try {
      set({ currentCalendarStatus: FetchStatus.PENDING });
      const res = await fetch("/api/calendar?calendarId=" + calendarId);
      if (res.ok) {
        const response = await res.json();
        const holiday = response.holiday;
        delete response.holiday;
        set({
          currentCalendarStatus: FetchStatus.SUCCESS,
          currentCalendar: response,
          holiday: holiday,
        });
      } else set({ currentCalendarStatus: FetchStatus.ERROR });
    } catch (error) {
      console.error(error);
      set({ currentCalendarStatus: FetchStatus.ERROR });
    }
  },
  updateCalendar: async ({ calendarId, teamId }) => {
    try {
      set({ updateCalendarStatus: FetchStatus.PENDING });
      const res = await fetch("/api/calendar", {
        method: "PUT",
        body: JSON.stringify({
          calendarId: calendarId ?? get().currentCalendar?.id,
          teamId,
        }),
      });

      if (res.ok) {
        const newCalendar = await res.json();

        const index = get().calendar?.findIndex((c) => c.id == newCalendar.id);

        if (index != -1) {
          const updateCalendar = [...(get().calendar ?? [])];
          updateCalendar[index!] = newCalendar;

          set({
            updateCalendarStatus: FetchStatus.SUCCESS,
            calendar: updateCalendar,
          });
        }
        return FetchStatus.SUCCESS;
      } else {
        set({ updateCalendarStatus: FetchStatus.ERROR });
        return FetchStatus.ERROR;
      }
    } catch (error) {
      console.error(error);
      set({ updateCalendarStatus: FetchStatus.ERROR });
      return FetchStatus.ERROR;
    }
  },
  async deleteHoliday(holidayId) {
    try {
      set({ deleteHolidayStatus: FetchStatus.PENDING });
      const { holiday } = get();

      const res = await fetch("/api/calendar/holiday", {
        method: "DELETE",
        body: JSON.stringify({ holidayId }),
      });

      if (res.ok) {
        const filteredHoldiay = holiday?.filter((data) => data.id != holidayId);
        set({
          deleteHolidayStatus: FetchStatus.SUCCESS,
          holiday: filteredHoldiay,
        });

        return FetchStatus.SUCCESS;
      } else {
        set({ deleteHolidayStatus: FetchStatus.ERROR });
        return FetchStatus.ERROR;
      }
    } catch (error) {
      console.error(error);
      set({ deleteHolidayStatus: FetchStatus.ERROR });
      return FetchStatus.ERROR;
    }
  },
  deleteHolidayLocal(holidayId) {
    const filteredHoldiay = get().holiday?.filter(
      (data) => data.id != holidayId
    );
    set({
      deleteHolidayStatus: FetchStatus.SUCCESS,
      holiday: filteredHoldiay,
    });
  },
  deleteCalendar: async () => {
    try {
      set({ deleteCalendarStatus: FetchStatus.PENDING });
      const res = await fetch("/api/calendar", {
        method: "DELETE",
        body: JSON.stringify({
          id: get().currentCalendar?.id ?? "",
        }),
      });

      if (res.ok) {
        const filteredCalendar = get().calendar?.filter(
          (data) => data.id != get().currentCalendar?.id
        );

        set({
          deleteCalendarStatus: FetchStatus.SUCCESS,
          calendar: filteredCalendar,
        });
        return FetchStatus.SUCCESS;
      } else {
        set({ deleteCalendarStatus: FetchStatus.ERROR });
        return FetchStatus.ERROR;
      }
    } catch (error) {
      console.error(error);
      set({ deleteCalendarStatus: FetchStatus.ERROR });
      return FetchStatus.ERROR;
    }
  },
  async getLeaveDetails(userId) {
    try {
      set({ getLeaveDetailsStatus: FetchStatus.PENDING });
      const res = await fetch(`/api/calendar/leave-details/${userId}`);

      if (res.ok) {
        const response = await res.json();
        set({
          getLeaveDetailsStatus: FetchStatus.SUCCESS,
          leaveDetails: response,
        });
      } else set({ getLeaveDetailsStatus: FetchStatus.ERROR });
    } catch (error) {
      console.error(error);
      set({ getLeaveDetailsStatus: FetchStatus.ERROR });
    }
  },
  setActiveEvent(id) {
    const event = get().events.find((event) => event.id == id) as ActiveEvent;
    const teams = useTeamStore
      .getState()
      .teams?.map((team) => {
        if (team.members.find((member) => member.id == event?.userId))
          return team.name;
      })
      .filter((teamName): teamName is string => !!teamName);

    set({ activeEvent: { ...event, teams: teams ?? [] } });
  },
  insertEvent(event) {
    const newEvent = event.new;
    const state = useAppStore.getState(); // Get state once
    const user = state.allUsers?.find((user) => user.id === event.new.userId);
    const approver = state.allUsers?.find(
      (u) => u.id === event.new.approvedById || u.id == user?.approverId
    );
    const leaveDetail = useLeaveStore
      .getState()
      .leavePolicy?.find((lp) => lp.id === event.new.leaveDetailId);

    if (user && leaveDetail) {
      set((state) => ({
        ...state,
        events: [
          ...(state.events ?? []), // Ensure events exists
          {
            ...newEvent,
            date: newEvent.start,
            name: user.name,
            colorCode: user.colorCode,
            occasion: "Leave",
            type: "LEAVE",
            leaveName: leaveDetail.name,
            approver: approver?.name,
          },
        ],
      }));

      if (newEvent.userId == useUserStore.getState().user?.id)
        useLeaveStore.setState((state) => ({
          ...state,
          leaveRecords: [
            ...(state.leaveRecords ?? []),
            {
              ...newEvent,
              approvedBy: { id: approver?.id, name: approver?.name },
              leaveDetail: { id: leaveDetail.id, name: leaveDetail.name },
            },
          ],
        }));
    }
  },

  updateEvent(event) {
    const events = get().events;
    const oldEvent = events.find((ev) => ev.id === event.old.id);

    if (oldEvent) {
      set((state) => ({
        ...state,
        events: [
          ...events.filter((ev) => ev.id !== oldEvent.id), // Fix filtering logic
          { ...oldEvent, status: event.new.status }, // Add updated event
        ],
      }));
    }
  },
  deleteEvent(payload) {
    set({ events: get().events.filter((ev) => ev.id != payload.old.id) });
    useLeaveStore.setState({
      leaveRecords: useLeaveStore
        .getState()
        .leaveRecords?.filter((lr) => lr.id != payload.old.id),
    });
  },
}));

export default useCalendarStore;
