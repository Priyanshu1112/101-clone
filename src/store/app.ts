import { create } from "zustand";
import { FetchStatus } from "./leave";
import { Channel } from "@slack/web-api/dist/types/response/ChannelsCreateResponse";
import { Role, User } from "@prisma/client";
import { CustomLeaveDetail } from "./user";
import { CustomCalendar } from "./calendar";
import { Event } from "@types";

export interface CustomAllUser extends User {
  approver: { id: string; name: string } | null;
  teamUsers:
    | {
        role: Role;
        teamId: string;
        user: { id: string; name: true };
        team: {
          id: string;
          name: string;
          workDay: { workWeek: number }[] | null;
        };
      }[]
    | null;
}

interface AppState {
  upcomingHoliday: CustomCalendar[] | null;
  onLeaveTomorrow: Event[] | null;
  onLeaveToday: Event[] | null;
  allUsersStatus: FetchStatus | null;
  allUsers: CustomAllUser[] | null;
  updateApproverStatus: FetchStatus | null;
  channels: Channel[] | null;
  channelStatus: FetchStatus | null;
  activeUser: CustomAllUser | null;
  leaveDetail: CustomLeaveDetail[] | null;
  navbarHeight: number;
  setNavbarHeight: (height: number) => void;
  getAllUsers: (companyId: string) => void;
  resetApp: () => void;
  updateApprover: (userId: string, approverId: string) => void;
  getChannels: () => void;
  setActiveUser: (id: string) => void;
  setUpcomingHoliday: (holiday: CustomCalendar[]) => void;
  setLeaveTomorrow: (leaves: Event[]) => void;
  setLeaveToday: (leaves: Event[]) => void;
}

const initialStaus = {
  allUsersStatus: null,
  updateApproverStatus: null,
  channelStatus: null,
};

const initialState = {
  upcomingHoliday: null,
  onLeaveTomorrow: null,
  onLeaveToday: null,
  allUsers: null,
  activeUser: null,
  channels: null,
  leaveDetail: null,
  navbarHeight: 0,
  ...initialStaus,
};

const useAppStore = create<AppState>((set, get) => ({
  ...initialState,
  resetApp: () => set(initialState),
  setNavbarHeight(height) {
    set({ navbarHeight: height });
  },
  getAllUsers: async (companyId) => {
    try {
      set({ allUsersStatus: FetchStatus.PENDING });
      const res = await fetch(`/api/user/${companyId}`);

      if (res.ok) {
        // console.log({allusers : await res.json()})
        const response = await res.json();
        set({
          allUsers: response,
          allUsersStatus: FetchStatus.SUCCESS,
        });
      } else set({ allUsersStatus: FetchStatus.ERROR });
    } catch (error) {
      console.error(error);
      set({ allUsersStatus: FetchStatus.ERROR });
    }
  },
  updateApprover: async (memberId, approverId) => {
    try {
      set({ updateApproverStatus: FetchStatus.PENDING });
      const res = await fetch(`/api/update-approver/${memberId}/${approverId}`);

      if (res.ok) {
        set({ updateApproverStatus: FetchStatus.SUCCESS });
      } else set({ updateApproverStatus: FetchStatus.ERROR });
    } catch (error) {
      console.error(error);
      set({ updateApproverStatus: FetchStatus.ERROR });
    }
  },
  async getChannels() {
    try {
      set({ channelStatus: FetchStatus.PENDING });
      const res = await fetch("/api/slack/channel");

      if (res.ok) {
        set({ channelStatus: FetchStatus.SUCCESS, channels: await res.json() });
      } else set({ channelStatus: FetchStatus.ERROR });
    } catch (error) {
      console.error(error);
      set({ channelStatus: FetchStatus.ERROR });
    }
  },
  async setActiveUser(userId) {
    const user = get().allUsers?.find((user) => user.id == userId);
    // console.log({ user, userId });
    set({ activeUser: user });
    try {
      const res = await fetch(
        `/api/user/leave-detail/${user?.id}/${user?.companyId}`
      );

      if (res.status == 200) set({ leaveDetail: await res.json() });
      // console.log({ res: await res.json() });
    } catch (error) {
      console.error(error);
    }
  },
  setUpcomingHoliday(holiday) {
    set({ upcomingHoliday: holiday });
  },
  setLeaveTomorrow(leaves) {
    set({ onLeaveTomorrow: leaves });
  },
  setLeaveToday(leaves) {
    set({ onLeaveToday: leaves });
  },
}));

export default useAppStore;
