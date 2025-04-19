/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Company,
  LeaveDetail,
  Notification,
  UpdateResponse,
  UpdateResponseStatus,
  User,
} from "@prisma/client";
import { CustomTeam, CustomUser, Members } from "next-auth";
import { getSession } from "next-auth/react";
import { create } from "zustand";
import { FetchStatus } from "./leave";
import { Role } from "@prisma/client";
import useUpdateStore from "./update";
import { LeaveSummary } from "@types";
import dayjs from "dayjs";

export interface CustomLeaveDetail extends LeaveDetail {
  detail: { year: string; taken: string; balance: string }[];
}

export interface CustomLeadTeam extends CustomTeam {
  members: User[] | null;
}

export interface CustomUpdateResponse extends UpdateResponse {
  update: { id: string; time: string; questions: string[] };
}

interface UserState {
  sessionFetched: boolean;
  user: CustomUser | null;
  company: Company | null;
  teams:
    | {
        role: Role;
        teamId: string;
        userId: string;
        team: { name: string; workDay?: { workWeek: number }[] };
      }[]
    | null;
  notifications: Notification[] | null;
  members: Members[] | null;
  leaveDetail: CustomLeaveDetail[] | null;
  leaveDetailStatus: FetchStatus | null;
  finishingOnboarding: string | null;
  updateUserStatus: FetchStatus | null;
  updateResponseStatus: FetchStatus | null;
  updateResponse: CustomUpdateResponse[] | null;
  currentUpdateResponse: CustomUpdateResponse | null;
  addUpdateResponseStatus: FetchStatus | null;
  reset: () => void;
  getSession: () => void;
  finishOnboarding: (teamName: string, teamMember: string) => void;
  getLeaveDetail: (companyId: string, userId: string) => void;
  updateUser: (userId: string, formData: object) => Promise<FetchStatus>;
  getUpdateResponse: (userId: string) => void;
  setCurrentUpdateRespone: (updateResponseId: string) => void;
  addUpdateResponse: (
    userId: string,
    updateResponseId: string,
    answer: object
  ) => Promise<FetchStatus>;
  updateURRL: (data: {
    id: string;
    status: UpdateResponseStatus;
    answer: string[];
  }) => void;
  insertURRL: (data) => void;
  connectUpdateSlackNotification: ({
    companyId,
    slackNotification,
    birthdayNotification,
    workanniversaryNotification,
    motivationNotification
  }: {
    companyId: string;
    slackNotification?: boolean;
    workanniversaryNotification?: object;
    birthdayNotification?: object;
    publicHolday?: object;
    motivationNotification?: object
  }) => Promise<FetchStatus>;
  connectUpdateCalendarNotification: ({
    userId,
    googleNotification,
  }: {
    userId: string;
    googleNotification: boolean;
  }) => Promise<FetchStatus>;
  updateLeaveSummary: (
    summary: LeaveSummary,
    isDaily: boolean
  ) => Promise<FetchStatus>;
  setLeaveDetail: (detials: CustomLeaveDetail[]) => FetchStatus;
  addNotification: (notification: Notification) => void;
  deleteNotifications: (notification: Notification) => void;
  upateNotifications: (notification: Notification) => void;
}

const fetchStatus = {
  leaveDetailStatus: null,
  updateUserStatus: null,
  updateResponseStatus: null,
  addUpdateResponseStatus: null,
};

const initialState = {
  id: null,
  name: null,
  email: null,
  colorCode: null,
  finishingOnboarding: null,
  sessionFetched: false,
  user: null,
  company: null,
  teams: null,
  leaveDetail: null,
  members: null,
  updateResponse: null,
  currentUpdateResponse: null,
  notifications: null,
  ...fetchStatus,
};

const useUserStore = create<UserState>((set, get) => ({
  ...initialState,
  reset: () => set(initialState),
  async getSession() {
    if (get().sessionFetched) return;

    const session = await getSession();

    if (session?.user) {
      const user = session.user;
      const members = session.user.members;
      const teams = session.user.teamUsers;
      const company = session.user.company;

      delete user.members;
      delete user.teamUsers;
      delete user.company;

      try {
        const res = await fetch(`/api/user/notification/${user.id}`);

        set({
          user,
          sessionFetched: true,
          teams,
          company,
          notifications: await res.json(),
          members: members?.sort((a, b) =>
            a.user.name.localeCompare(b.user.name)
          ),
        });
      } catch (error) {}
    }
  },
  async finishOnboarding(teamName, teamMember) {
    set({ finishingOnboarding: "pending" });
    const res = await fetch("/api/user/finish-onboarding", {
      method: "PUT",
      body: JSON.stringify({ teamName, teamMember }),
    });

    const company = await res.json();

    if (res.ok)
      set({
        finishingOnboarding: "success",
        company,
        user: { ...get().user!, needsOnboarding: false },
      });
    else
      set({
        finishingOnboarding: "error",
        company: company ? company : get().company,
      });
  },
  getLeaveDetail: async (companyId, userId) => {
    try {
      set({ leaveDetailStatus: FetchStatus.PENDING });

      const res = await fetch(
        `/api/user/leave-detail?companyId=${companyId}&userId=${userId}`
      );

      if (res.ok) {
        const response = await res.json();
        set({ leaveDetailStatus: FetchStatus.SUCCESS, leaveDetail: response });
      } else set({ leaveDetailStatus: FetchStatus.ERROR });
    } catch (error) {
      console.error(error);
      set({ leaveDetailStatus: FetchStatus.ERROR });
    }
  },
  async updateUser(userId, formData) {
    try {
      set({ updateUserStatus: FetchStatus.PENDING });
      const res = await fetch("/api/user/update/" + userId, {
        method: "PUT",
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const { user } = await res.json(); // Assuming the API returns updated user data

        set((state) => ({
          updateUserStatus: FetchStatus.SUCCESS,
          user: { ...state.user, ...user }, // Merge updated fields with the existing user state
        }));
        return FetchStatus.SUCCESS;
      } else {
        set({ updateUserStatus: FetchStatus.ERROR });
        return FetchStatus.ERROR;
      }
    } catch (error) {
      console.error(error);
      set({ updateUserStatus: FetchStatus.ERROR });
      return FetchStatus.ERROR;
    }
  },
  async getUpdateResponse(userId) {
    try {
      set({ updateResponseStatus: FetchStatus.PENDING });
      const res = await fetch("/api/user/update-response/" + userId);

      if (res.status == 200) {
        const response = await (await res).json();
        set({
          updateResponseStatus: FetchStatus.SUCCESS,
          updateResponse: response,
        });
      } else set({ updateResponseStatus: FetchStatus.ERROR });
    } catch (error) {
      console.error(error);
      set({ updateResponseStatus: FetchStatus.ERROR });
    }
  },
  setCurrentUpdateRespone(updateResponseId) {
    const res = get().updateResponse?.find(
      (response) => response.id == updateResponseId
    );

    if (res) set({ currentUpdateResponse: res });
  },
  async addUpdateResponse(userId, updateResponseId, answer) {
    try {
      set({ addUpdateResponseStatus: FetchStatus.PENDING });
      const res = await fetch("/api/user/update-response/" + userId, {
        method: "PUT",
        body: JSON.stringify({ answer, updateResponseId }),
      });
      if (res.status == 200) {
        set({ addUpdateResponseStatus: FetchStatus.SUCCESS });
        return FetchStatus.SUCCESS;
      } else set({ addUpdateResponseStatus: FetchStatus.ERROR });
      return FetchStatus.ERROR;
    } catch (error) {
      console.error(error);
      set({ addUpdateResponseStatus: FetchStatus.ERROR });
      return FetchStatus.ERROR;
    }
  },
  updateURRL(data) {
    set((state) => ({
      updateResponse: state.updateResponse?.map((res) => {
        if (res.id === data.id) {
          // Return a new object for the updated item
          return {
            ...res,
            answer: data.answer,
            status: data.status,
          };
        }
        return res;
      }),
    }));
  },
  insertURRL(data) {
    const update = useUpdateStore
      .getState()
      .updates?.find((update) => update.id === data.updateId);

    set((state) => ({
      updateResponse: [
        ...(state.updateResponse || []), // Ensure it's an array before spreading
        {
          ...data,
          update: {
            id: update?.id,
            time: update?.time,
            questions: update?.questions,
          },
        },
      ],
    }));
  },
  async connectUpdateSlackNotification({
    companyId,
    slackNotification,
    birthdayNotification,
    workanniversaryNotification,
    publicHolday,
    motivationNotification
  }) {
    try {
      const res = await fetch("/api/integration", {
        method: "PUT",
        body: JSON.stringify({
          companyId,
          slackNotification,
          birthdayNotification,
          workanniversaryNotification,
          publicHolday,
          motivationNotification
        }),
      });

      if (res.status == 200) {
        const response = await res.json();
        set({
          company: response,
        });
        return FetchStatus.SUCCESS;
      } else return FetchStatus.ERROR;
    } catch (error) {
      console.error(error);
      return FetchStatus.ERROR;
    }
  },
  async connectUpdateCalendarNotification({ userId, googleNotification }) {
    try {
      const res = await fetch("/api/integration/calendar", {
        method: "PUT",
        body: JSON.stringify({ userId, googleNotification }),
      });

      if (res.status == 200) {
        set({ user: await res.json() });
        return FetchStatus.SUCCESS;
      }

      return FetchStatus.ERROR;
    } catch (error) {
      console.error(error);
      return FetchStatus.ERROR;
    }
  },
  async updateLeaveSummary(summary, isDaily) {
    try {
      const res = await fetch(
        `/api/leave-summary/${isDaily ? "daily" : "weekly"}`,
        {
          method: "PUT",
          body: JSON.stringify({ ...summary, companyId: get()?.company?.id }),
        }
      );

      if (res.status == 200) {
        set({ company: await res.json() });
        return FetchStatus.SUCCESS;
      } else {
        return FetchStatus.ERROR;
      }
    } catch (error) {
      return FetchStatus.ERROR;
    }
  },
  setLeaveDetail(details) {
    try {
      set({ leaveDetail: details });
      return FetchStatus.SUCCESS;
    } catch (error) {
      return FetchStatus.ERROR;
    }
  },
  addNotification(notification) {
    set({
      notifications: [
        ...(get().notifications ?? []),
        {
          ...notification,
          createdAt: dayjs.utc(notification.createdAt).toDate(),
        },
      ],
    });
  },
  deleteNotifications(notification) {
    set({
      notifications: [
        ...(get().notifications?.filter((n) => n.id != notification.id) ?? []),
      ],
    });
  },
  upateNotifications(notification) {
    set({
      notifications: [
        ...(get().notifications?.map((n) =>
          n.id != notification.id ? n : { ...n, leaveRecordId: null }
        ) ?? []),
      ],
    });
  },
}));

export default useUserStore;
