import { create } from "zustand";
import useUserStore from "./user";
import { Role, TeamUser, UpdateResponse, Workday } from "@prisma/client";
import { FetchStatus } from "./leave";
import { Team } from "@prisma/client";

export interface CustomMember {
  id: string;
  name: string;
  email: string;
  role: Role;
  colorCode: number;
  leaveRecord: { id: string; start: string }[];
  isArchive: boolean;
  approver: {
    id: string;
    name: string;
  };
  updateResponse: UpdateResponse[] | null;
}

export interface CustomTeamUser extends TeamUser {
  user: {
    id: string;
    name: string;
    colorCode: string;
    email: string;
    approver: {
      id: string;
      name: string;
    };
  } | null;
}

export interface CustomTeam extends Team {
  calendar: { id: string; country: string }[];
  workDay: { id: string; name: string }[];
  members: CustomMember[];
}

interface TeamState {
  fetchTeam: FetchStatus | null;
  teams: CustomTeam[] | null;
  currentTeam: CustomTeam | null;
  creatingTeam: boolean;
  createdTeam: boolean;
  errorCreatingTeam: string | null;
  workDays: Workday[] | null;
  addWorkDayStatus: FetchStatus | null;
  updateWorkdayStatus: FetchStatus | null;
  deleteWorkdayStatus: FetchStatus | null;
  currentWorkday: Workday | null;
  teamUser: CustomTeamUser[] | null;
  teamUserStatus: FetchStatus | null;
  changeTeamApproverStatus: FetchStatus | null;
  changeUserApproverStatus: FetchStatus | null;
  updateTeamStatus: FetchStatus | null;
  resetTeam: () => void;
  createTeam: (formData: object) => Promise<FetchStatus>;
  resetStatus: () => void;
  setTeams: (companyId: string) => void;
  fetchTeamUser: () => void;
  setCurrentTeamIndex: (index: number) => void;
  fetchWorkDays: (companyId: string) => void;
  addWorkDay: ({
    name,
    workWeek,
    startOfWeek,
    weekOff,
    team,
    member,
  }: {
    name: string;
    workWeek: string;
    startOfWeek: string;
    weekOff: string[];
    team: string;
    member: string;
  }) => void;
  updateWorkday: ({
    id,
    name,
    workWeek,
    startOfWeek,
    weekOff,
    team,
    member,
  }: {
    id: string;
    name: string;
    workWeek: string;
    startOfWeek: string;
    weekOff: string[];
    team: string;
    member: string;
  }) => void;
  setCurrentWorkday: (workDayId: string) => void;
  deleteWorkday: () => void;
  changeTeamApprover: (teamId: string, approverId: string) => void;
  changeUserApprover: (userId: string, approverId: string) => void;
  archiveUser: (userId: string, teamId: string) => Promise<FetchStatus>;
  updateTeam: (teamId: string, formData: object) => Promise<FetchStatus>;
  deleteTeam: (teamId: string) => Promise<FetchStatus>;
}

const fetchStatus = {
  fetchTeam: null,
  addWorkDayStatus: null,
  updateWorkdayStatus: null,
  deleteWorkdayStatus: null,
  creatingTeam: false,
  errorCreatingTeam: null,
  createdTeam: false,
  teamUserStatus: null,
  changeTeamApproverStatus: null,
  changeUserApproverStatus: null,
  updateTeamStatus: null,
};

const initialState = {
  teams: null,
  // currentTeamIndex: 0,
  currentTeam: null,
  workDays: null,
  currentWorkday: null,
  teamUser: null,
  ...fetchStatus,
};

const useTeamStore = create<TeamState>((set, get) => ({
  ...initialState,
  resetTeam: () => set(initialState),
  resetStatus: () => set(fetchStatus),
  createTeam: async (formData) => {
    set({ creatingTeam: true, errorCreatingTeam: null }); // Set creating state and reset error

    const { user, company } = useUserStore.getState();
    try {
      const res = await fetch("/api/team", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formData,
          lead: user?.id,
          companyId: company?.id,
        }),
      });

      const { message, status, team } = await res.json();

      if (status !== 200) {
        set({ errorCreatingTeam: message });
        return FetchStatus.ERROR;
      } else {
        set((state) => ({
          creatingTeam: false,
          createdTeam: true,
          teams: state.teams ? [...state.teams, team] : [team],
        }));
        return FetchStatus.SUCCESS;
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      set({
        creatingTeam: false,
        errorCreatingTeam: errorMessage,
      });
      return FetchStatus.ERROR;
    }
  },
  setTeams: async (companyId) => {
    try {
      set({ fetchTeam: FetchStatus.PENDING });
      const res = await fetch("/api/team/" + companyId);

      if (res.ok) {
        const response = await res.json();
        set({
          teams: response,
          fetchTeam: FetchStatus.SUCCESS,
          currentTeam: response[0] ?? {},
        });
      } else set({ fetchTeam: FetchStatus.ERROR });
    } catch (error) {
      console.error(error);
      set({ fetchTeam: FetchStatus.ERROR });
    }
  },
  fetchTeamUser: async () => {
    try {
      set({ teamUserStatus: FetchStatus.PENDING });
      const teams = get()
        .teams?.map((team) => team.id)
        ?.join("/");
      const res = await fetch("/api/team/team-user/" + teams);

      if (res.ok) {
        const response = await res.json();
        set({ teamUser: response, teamUserStatus: FetchStatus.SUCCESS });
      } else set({ teamUserStatus: FetchStatus.ERROR });
    } catch (error) {
      console.error(error);
      set({ teamUserStatus: FetchStatus.ERROR });
    }
  },
  setCurrentTeamIndex: (index) => {
    const teams = get().teams;
    set({ currentTeam: teams && teams.length > 0 ? teams[index] : null });
  },
  fetchWorkDays: async (companyId) => {
    try {
      const res = await fetch("/api/workday/?companyId=" + companyId);

      if (res.ok) {
        const response = await res.json();
        set({ workDays: response });
      }
    } catch (error) {
      console.error(error);
    }
  },
  addWorkDay: async ({
    name,
    workWeek,
    startOfWeek,
    weekOff,
    team,
    member,
  }) => {
    try {
      set({ addWorkDayStatus: FetchStatus.PENDING });

      const res = await fetch("/api/workday", {
        method: "POST",
        body: JSON.stringify({
          name,
          workWeek,
          startOfWeek,
          weekOff,
          teamId: team,
          member,
        }),
      });

      if (res.ok) {
        const response = await res.json();
        set({
          addWorkDayStatus: FetchStatus.SUCCESS,
          workDays: [response, ...(get().workDays ?? [])],
        });
      } else set({ addWorkDayStatus: FetchStatus.ERROR });
    } catch (error) {
      console.error(error);
      set({ addWorkDayStatus: FetchStatus.ERROR });
    }
  },
  setCurrentWorkday: (workdayId) => {
    const currentWorkday = get().workDays?.find((day) => day.id == workdayId);

    set({ currentWorkday });
  },
  updateWorkday: async ({
    id,
    name,
    workWeek,
    startOfWeek,
    weekOff,
    team,
    member,
  }) => {
    try {
      set({ updateWorkdayStatus: FetchStatus.PENDING });
      const res = await fetch("/api/workday", {
        method: "PUT",
        body: JSON.stringify({
          id,
          name,
          workWeek,
          startOfWeek,
          weekOff,
          teamId: team,
          member,
        }),
      });

      if (res.ok) {
        const response = await res.json();

        const updatedWorkday = get().workDays?.map((day) =>
          day.id == response.id ? response : day
        );

        set({
          updateWorkdayStatus: FetchStatus.SUCCESS,
          workDays: updatedWorkday,
        });
      } else set({ updateWorkdayStatus: FetchStatus.ERROR });
    } catch (error) {
      console.error(error);
      set({ updateWorkdayStatus: FetchStatus.ERROR });
    }
  },
  deleteWorkday: async () => {
    try {
      set({ deleteWorkdayStatus: FetchStatus.PENDING });
      const res = await fetch("/api/workday", {
        method: "DELETE",
        body: JSON.stringify({
          id: get().currentWorkday?.id ?? "",
        }),
      });

      if (res.ok) {
        const filteredWorkday = get().workDays?.filter(
          (day) => day.id != get().currentWorkday?.id
        );

        set({
          deleteWorkdayStatus: FetchStatus.SUCCESS,
          workDays: filteredWorkday,
        });
      } else set({ deleteWorkdayStatus: FetchStatus.ERROR });
    } catch (error) {
      console.error(error);
      set({ deleteWorkdayStatus: FetchStatus.ERROR });
    }
  },
  async changeTeamApprover(teamId, approverId) {
    try {
      set({ changeTeamApproverStatus: FetchStatus.PENDING });
      const res = await fetch("/api/team/change-approver/" + teamId, {
        method: "PUT",
        body: JSON.stringify({ approverId }),
      });

      if (res.ok) {
        set({
          changeTeamApproverStatus: FetchStatus.SUCCESS,
        });
      } else set({ changeTeamApproverStatus: FetchStatus.ERROR });
    } catch (error) {
      console.error(error);
      set({ changeTeamApproverStatus: FetchStatus.ERROR });
    }
  },
  async changeUserApprover(userId, approverId) {
    try {
      set({ changeUserApproverStatus: FetchStatus.PENDING });
      const res = await fetch(`/api/user/update/${userId}`, {
        method: "PUT",
        body: JSON.stringify({ approverId }),
      });

      if (res.ok) {
        set({
          changeUserApproverStatus: FetchStatus.SUCCESS,
        });
      } else set({ changeUserApproverStatus: FetchStatus.ERROR });
    } catch (error) {
      console.error(error);
      set({ changeUserApproverStatus: FetchStatus.ERROR });
    }
  },
  async archiveUser(userId, teamId) {
    try {
      const res = await fetch(`/api/team/archive/${teamId}/${userId}`);

      if (res.status == 200) {
        const team = get().teams?.find((team) => team.id === teamId);

        if (team) {
          const updatedMembers = team.members.map((member) =>
            member.id === userId ? { ...member, isArchive: true } : member
          );

          set({
            teams: get().teams?.map((t) =>
              t.id === teamId ? { ...t, members: updatedMembers } : t
            ),
          });
        }

        return FetchStatus.SUCCESS;
      }
      return FetchStatus.ERROR;
    } catch (error) {
      console.error(error);
      return FetchStatus.ERROR;
    }
  },
  async updateTeam(teamId, formData) {
    try {
      set({ updateTeamStatus: FetchStatus.PENDING });
      const res = await fetch("/api/team", {
        method: "PUT",
        body: JSON.stringify({ teamId, formData }),
      });

      if (res.status == 200) {
        const { team } = await res.json();

        set({
          teams: [...(get().teams?.filter((t) => t.id != team.id) ?? []), team],
        });

        return FetchStatus.SUCCESS;
      } else return FetchStatus.ERROR;
    } catch (error) {
      console.error(error);
      return FetchStatus.ERROR;
    }
  },
  async deleteTeam(teamId) {
    try {
      const res = await fetch("/api/team", {
        method: "DELETE",
        body: JSON.stringify({ teamId }),
      });

      if (res.status == 200) {
        return FetchStatus.SUCCESS;
      } else return FetchStatus.ERROR;
    } catch (error) {
      console.error(error);
      return FetchStatus.ERROR;
    }
  },
}));

export default useTeamStore;
