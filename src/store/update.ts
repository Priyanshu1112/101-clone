import { Update } from "@prisma/client";
import { create } from "zustand";

import { FetchStatus } from "./leave";

export interface CustomUpdate extends Update {
  members: { id: string }[] | null;
}

interface UpdateState {
  updates: CustomUpdate[] | null;
  updatesStatus: FetchStatus | null;
  addUpdateStatus: FetchStatus | null;
  currentUpdate: CustomUpdate | null;
  reset: () => void;
  getUpdates: (companyId: string) => void;
  addUpdate: (formDate: object) => Promise<FetchStatus>;
  update: (formDate: object) => Promise<FetchStatus>;
  setCurrentUpdate: (updateId: string) => void;
  deleteUpdate: (id: string) => Promise<FetchStatus>;
}

const initialStatus = {
  updatesStatus: null,
  addUpdateStatus: null,
};

const initialState = {
  updates: null,
  currentUpdate: null,
  ...initialStatus,
};

const useUpdateStore = create<UpdateState>((set, get) => ({
  ...initialState,
  reset: () => set(initialState),
  async getUpdates(companyId) {
    try {
      set({ updatesStatus: FetchStatus.PENDING });
      const res = await fetch("/api/update/" + companyId);

      if (res.status == 200) {
        const response = await res.json();
        // console.log(response);
        set({ updatesStatus: FetchStatus.SUCCESS, updates: response });
      } else set({ updatesStatus: FetchStatus.ERROR });
    } catch (error) {
      console.error(error);
      set({ updatesStatus: FetchStatus.ERROR });
    }
  },
  async addUpdate(formData) {
    try {
      set({ addUpdateStatus: FetchStatus.PENDING });
      const res = await fetch("/api/update", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (res.status == 200) {
        const response = await res.json();
        set({
          addUpdateStatus: FetchStatus.SUCCESS,
          updates: [
            ...(get().updates ?? []), // Ensure updates is always an array, even if it's null
            response,
          ],
        });
        return FetchStatus.SUCCESS;
      } else {
        set({ addUpdateStatus: FetchStatus.ERROR });
        return FetchStatus.ERROR;
      }
    } catch (error) {
      console.error(error);
      set({ addUpdateStatus: FetchStatus.ERROR });
      return FetchStatus.ERROR;
    }
  },
  async update(formData) {
    try {
      const res = await fetch("/api/update", {
        method: "PUT",
        body: JSON.stringify(formData),
      });

      if (res.status == 200) {
        const response = await res.json();

        set((state) => {
          return {
            ...state,
            updates: state.updates?.map((update) =>
              update.id == response.id ? response : update
            ),
          };
        });

        return FetchStatus.SUCCESS;
      } else return FetchStatus.ERROR;
    } catch (error) {
      console.error(error);
      return FetchStatus.ERROR;
    }
  },
  async deleteUpdate(id) {
    try {
      const res = await fetch("/api/update", {
        method: "DELETE",
        body: JSON.stringify({ id }),
      });

      if (res.status == 200) {
        set((state) => ({
          ...state,
          updates: state.updates?.filter((update) => update.id !== id),
        }));
        return FetchStatus.SUCCESS;
      } else return FetchStatus.ERROR;
    } catch (error) {
      console.error(error);
      return FetchStatus.ERROR;
    }
  },
  setCurrentUpdate(updateId) {
    const update = get().updates?.find((update) => update.id == updateId);
    set({ currentUpdate: update });
  },
}));

export default useUpdateStore;
