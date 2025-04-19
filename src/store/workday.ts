import { Role, Workday } from "@prisma/client";
import { create } from "zustand";
import { FetchStatus } from "./leave";

interface WorkdayState {
  workday: Workday | null;
  workdayStatus: FetchStatus | null;
  reset: () => void;
  getWorkday: (teams: { role: Role; teamId: string; userId: string }[]) => void;
}

const initialStatus = {
  workdayStatus: null,
};

const initialState = {
  workday: null,
  ...initialStatus,
};

const useWorkdayStore = create<WorkdayState>((set) => ({
  ...initialState,
  reset: () => set(initialState),
  getWorkday: async (teams) => {
    try {
      set({ workdayStatus: FetchStatus.PENDING });

      if (!teams) return set({ workdayStatus: FetchStatus.PENDING });

      let teamId: string | undefined;

      // If there are multiple teams, find the first team where the role is 'Lead'
      if (teams.length > 1) {
        teamId = teams.find((team) => team.role === Role.Lead)?.teamId;
      } else {
        // Otherwise, default to the first team's ID
        teamId = teams[0]?.teamId;
      }

      // Fallback: If no teamId is found, use the first team's ID as a backup
      if (!teamId && teams.length > 0) {
        teamId = teams[0].teamId;
      }

      const res = await fetch(`/api/workday/${teamId}`);

      if (res.ok) {
        set({ workdayStatus: FetchStatus.SUCCESS, workday: await res.json() });
      } else set({ workdayStatus: FetchStatus.ERROR });
    } catch (error) {
      console.error(error);
      set({ workdayStatus: FetchStatus.ERROR });
    }
  },
}));

export default useWorkdayStore;
