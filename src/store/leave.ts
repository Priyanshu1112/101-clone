import {
  AllowanceType,
  LeaveDetail,
  LeaveStatus,
  LeaveTime,
  LeaveType,
} from "@prisma/client";
import { create } from "zustand";
import useUserStore from "./user";
import useCalendarStore from "./calendar";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { getDeducted } from "@/utils/helpers/getDeductes";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

export enum FetchStatus {
  PENDING,
  SUCCESS,
  ERROR,
}

interface LeaveStore {
  fetchDetail: FetchStatus | null;
  leaveDetail: LeaveDetail | null;
  fetchPolicy: FetchStatus | null;
  leavePolicy: LeaveDetail[] | null;
  addLeaveStatus: FetchStatus | null;
  updateLeaveStatus: FetchStatus | null;
  deleteLeaveStatus: FetchStatus | null;
  applyLeaveStatus: FetchStatus | null;
  leaveRecords:
    | {
        id: string;
        start: string;
        end: string;
        startTime: LeaveTime;
        endTime: LeaveTime;
        status: LeaveStatus;
        approvedBy: {
          id: string;
          name: string;
        };
        leaveDetail: {
          id: string;
          name: string;
        };
        reason: string | null;
      }[]
    | null;
  leaveRecordsStatus: FetchStatus | null;
  reset: () => void;
  resetFetch: () => void;
  applyLeave: (
    userId: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formData: any,
    autoApprove: boolean,
    deducted: number
  ) => Promise<FetchStatus>;
  cancelLeave: (leaveId: string) => Promise<FetchStatus>;
  rejectLeave: (leaveId: string) => Promise<FetchStatus>;
  approveLeave: (leaveId: string) => Promise<FetchStatus>;
  addLeave: (
    companyId: string,
    name: string,
    description: string,
    needsApproval: boolean | undefined,
    notifyAdmin: boolean | undefined,
    carryForward: boolean | undefined,
    unlimmited: boolean | undefined,
    addedOn: string,
    type: LeaveType,
    allowanceType: AllowanceType | undefined,
    allowance: string | undefined
  ) => Promise<FetchStatus>;
  updateLeave: (
    leaveId: string,
    name: string,
    description: string,
    needsApproval: boolean | undefined,
    notifyAdmin: boolean | undefined,
    carryForward: boolean | undefined,
    unlimmited: boolean | undefined,
    addedOn: string,
    type: LeaveType,
    allowanceType: AllowanceType | undefined,
    allowance: string | undefined
  ) => Promise<FetchStatus>;
  getLeavePolicy: (companyId: string) => void;
  fetchLeaveDetail: (id: string) => void;
  deleteLeave: (id: string) => Promise<FetchStatus>;
  getLeaveRecords: (userId: string) => void;
}

const fetchStatus = {
  fetchDetail: null,
  addLeaveStatus: null,
  fetchPolicy: null,
  updateLeaveStatus: null,
  deleteLeaveStatus: null,
  applyLeaveStatus: null,
  leaveRecordsStatus: null,
};

const initialState = {
  leavePolicy: null,
  leaveDetail: null,
  leaveRecords: null,
  ...fetchStatus,
};

const useLeaveStore = create<LeaveStore>((set, get) => ({
  ...initialState,
  reset: () => set(initialState),
  resetFetch: () => set(fetchStatus),
  async applyLeave(userId, formData, autoApprove, deducted) {
    try {
      set({ applyLeaveStatus: FetchStatus.PENDING });
      const res = await fetch(`/api/leave/${userId}`, {
        method: "POST",
        body: JSON.stringify({ formData, autoApprove }),
      });

      if (res.status == 200) {
        set({ applyLeaveStatus: FetchStatus.SUCCESS });
        const currYear = dayjs().tz("Asia/Kolkata").year().toString();
        const leaveDetail = useUserStore.getState().leaveDetail;

        const updatedLD = leaveDetail?.map((ld) => {
          if (ld.id === formData.leaveDetailId) {
            let updatedDetails;
            if (!ld.detail || ld.detail.length === 0) {
              // No detail exists: create a new one for the current year.

              updatedDetails = [
                {
                  year: currYear,
                  taken: deducted.toString(),
                  balance: (Number(ld.allowance) - deducted).toString(),
                },
              ];
            } else if (!ld.detail.find((d) => d.year === currYear)) {
              // Detail exists but no record for current year: add a new entry.
              updatedDetails = [
                ...ld.detail,
                {
                  year: currYear,
                  taken: deducted.toString(),
                  balance: (Number(ld.allowance) - deducted).toString(),
                },
              ];
            } else {
              // An entry for the current year exists: update it.
              updatedDetails = ld.detail.map((d) => {
                if (d.year === currYear) {
                  const newTaken = Number(d.taken) + deducted;
                  const newBalance = Number(d.balance) - deducted;

                  return {
                    ...d,
                    taken: newTaken.toString(),
                    balance: newBalance.toString(),
                  };
                }
                return d;
              });
            }
            return {
              ...ld,
              detail: updatedDetails,
            };
          }
          return ld;
        });

        useUserStore.setState({ leaveDetail: updatedLD });

        // useUserStore.setState((state) => {

        return FetchStatus.SUCCESS;
      } else set({ applyLeaveStatus: FetchStatus.ERROR });
      return FetchStatus.ERROR;
    } catch (error) {
      console.error(error);
      set({ applyLeaveStatus: FetchStatus.ERROR });
      return FetchStatus.ERROR;
    }
  },
  async cancelLeave(leaveId) {
    try {
      // Make the DELETE API call to cancel the leave.
      const leave = get().leaveRecords?.find((lr) => lr.id == leaveId);
      const res = await fetch(
        "/api/leave/" + useUserStore.getState().user?.id,
        {
          method: "DELETE",
          body: JSON.stringify({ leaveId }),
        }
      );

      if (res.status === 200) {
        // Retrieve the leave record from your calendar store.

        if (leave) {
          // Calculate the deducted amount for this leave.
          const deducted = getDeducted(
            leave.start,
            leave.end,
            leave.startTime,
            leave.endTime,
            !!leave.end
          );

          // Get the current year as a string in IST.
          const currYear = dayjs().tz("Asia/Kolkata").year().toString();

          // Get the current leave details from the user store.
          const leaveDetail = useUserStore.getState().leaveDetail;

          // Map over each leave detail to update the record matching the leave's detail.
          const updatedLD = leaveDetail?.map((ld) => {
            if (ld.id === leave.leaveDetail.id) {
              // Update the detail array for the current year.
              const updatedDetails = ld.detail.map((d) => {
                if (d.year === currYear) {
                  const newTaken = Number(d.taken) - deducted;
                  const newBalance = Number(d.balance) + deducted;

                  return {
                    ...d,
                    taken: newTaken.toString(),
                    balance: newBalance.toString(),
                  };
                }
                return d;
              });
              return {
                ...ld,
                detail: updatedDetails,
              };
            }
            return ld;
          });

          // Update the user store with the modified leave details.
          useUserStore.setState({ leaveDetail: updatedLD });
        }
      }

      return FetchStatus.SUCCESS;
    } catch (error) {
      console.error("Error in cancelLeave:", error);
      return FetchStatus.ERROR;
    }
  },
  async rejectLeave(leaveId) {
    try {
      const res = await fetch(
        `/api/leave/${useUserStore.getState().user?.id}/reject`,
        { method: "PUT", body: JSON.stringify({ leaveId }) }
      );

      if (res.status == 200) {
        const events = useCalendarStore
          .getState()
          .events.filter((event) => event.id != leaveId);

        useCalendarStore.setState({
          events: [...events],
        });

        return FetchStatus.SUCCESS;
      }

      return FetchStatus.ERROR;
    } catch (error) {
      console.log(error);
      return FetchStatus.ERROR;
    }
  },
  async approveLeave(leaveId) {
    try {
      const res = await fetch(
        `/api/leave/${useUserStore.getState().user?.id}/approve`,
        { method: "PUT", body: JSON.stringify({ leaveId }) }
      );

      if (res.status == 200) {
        const events = useCalendarStore.getState().events.map((event) => {
          if (event.id == leaveId) return { ...event, status: "APPROVED" };

          return event;
        });

        useCalendarStore.setState({
          events: [...events],
        });
        return FetchStatus.SUCCESS;
      }

      return FetchStatus.ERROR;
    } catch (error) {
      console.log(error);
      return FetchStatus.ERROR;
    }
  },
  async addLeave(
    companyId,
    name,
    description,
    needsApproval,
    notifyAdmin,
    carryForward,
    unlimmited,
    addedOn,
    type,
    allowanceType,
    allowance
  ) {
    try {
      set({
        addLeaveStatus: FetchStatus.PENDING,
      });

      const res = await fetch("/api/admin/leave-detail", {
        method: "POST",
        body: JSON.stringify({
          companyId,
          name,
          description,
          needsApproval,
          notifyAdmin,
          carryForward,
          unlimmited,
          addedOn,
          type,
          allowanceType,
          allowance,
        }),
      });

      if (res.ok) {
        const leaveDetail = (await res.json()).leaveDetail;
        const prev = get().leavePolicy;

        set({
          addLeaveStatus: FetchStatus.SUCCESS,
          leavePolicy: prev ? [leaveDetail, ...prev] : [leaveDetail],
        });
        return FetchStatus.SUCCESS;
      } else {
        set({
          addLeaveStatus: FetchStatus.ERROR,
        });
        return FetchStatus.ERROR;
      }
    } catch (err) {
      console.error(err);
      set({
        addLeaveStatus: FetchStatus.ERROR,
      });
      return FetchStatus.ERROR;
    }
  },
  async updateLeave(
    leaveId,
    name,
    description,
    needsApproval,
    notifyAdmin,
    carryForward,
    unlimmited,
    addedOn,
    type,
    allowanceType,
    allowance
  ) {
    try {
      set({
        updateLeaveStatus: FetchStatus.PENDING,
      });

      const res = await fetch("/api/admin/leave-detail", {
        method: "PUT",
        body: JSON.stringify({
          leaveId,
          name,
          description,
          needsApproval,
          notifyAdmin,
          carryForward,
          unlimmited,
          addedOn,
          type,
          allowanceType,
          allowance,
        }),
      });

      if (res.ok) {
        const leaveDetail = (await res.json()).leaveDetail;
        const prev = get().leavePolicy;

        set({
          updateLeaveStatus: FetchStatus.SUCCESS,
          leavePolicy: prev
            ? prev.map((leave) =>
                leave.id === leaveDetail.id ? leaveDetail : leave
              )
            : [leaveDetail], // If no previous leavePolicy exists, create a new array
        });
        return FetchStatus.SUCCESS;
      } else {
        set({
          updateLeaveStatus: FetchStatus.ERROR,
        });
        return FetchStatus.ERROR;
      }
    } catch (err) {
      console.error(err);
      set({
        updateLeaveStatus: FetchStatus.ERROR,
      });
      return FetchStatus.ERROR;
    }
  },
  async getLeavePolicy(companyId) {
    try {
      set({ fetchPolicy: FetchStatus.PENDING });
      const res = await fetch(`/api/admin/leave-detail?companyId=${companyId}`);

      if (res.status == 200) {
        const response = await res.json();

        set({
          leavePolicy: response,
          // .filter((data) => {
          //   if (data.name.includes("Menstrual")) {
          //     return useUserStore.getState().user?.gender == "Female";
          //   }
          //   return true;
          // }),
          fetchPolicy: FetchStatus.SUCCESS,
        });
      } else {
        set({
          fetchPolicy: FetchStatus.ERROR,
        });
      }
    } catch (error) {
      console.error(error);
      set({
        fetchPolicy: FetchStatus.ERROR,
      });
    }
  },
  async fetchLeaveDetail(leaveId) {
    try {
      set({ fetchDetail: FetchStatus.PENDING });
      const leaveDetail = get().leavePolicy?.find(
        (policy) => policy.id == leaveId
      );

      if (leaveDetail) {
        set({
          leaveDetail,
          fetchDetail: FetchStatus.SUCCESS,
        });
      } else {
        set({
          fetchDetail: FetchStatus.ERROR,
        });
      }
    } catch (error) {
      console.error(error);
      set({
        fetchDetail: FetchStatus.ERROR,
      });
    }
  },
  async deleteLeave(leaveId) {
    try {
      set({ deleteLeaveStatus: FetchStatus.PENDING });
      const res = await fetch("/api/admin/leave-detail", {
        method: "DELETE",
        body: JSON.stringify({ leaveId }),
      });

      if (res.ok) {
        set((state) => ({
          deleteLeaveStatus: FetchStatus.SUCCESS,
          leavePolicy: state.leavePolicy?.filter(
            (leave) => leave.id !== leaveId
          ),
        }));
        return FetchStatus.SUCCESS;
      } else {
        set({ deleteLeaveStatus: FetchStatus.ERROR });
        return FetchStatus.ERROR;
      }
    } catch (error) {
      console.error(error);
      set({ deleteLeaveStatus: FetchStatus.ERROR });
      return FetchStatus.ERROR;
    }
  },
  async getLeaveRecords(userId) {
    try {
      set({ leaveRecordsStatus: FetchStatus.PENDING });
      const res = await fetch("/api/leave/" + userId);

      if (res.ok) {
        const response = await res.json();
        set({
          leaveRecordsStatus: FetchStatus.SUCCESS,
          leaveRecords: response,
        });
      } else set({ leaveRecordsStatus: FetchStatus.ERROR });
    } catch (error) {
      console.error(error);
      set({ leaveRecordsStatus: FetchStatus.ERROR });
    }
  },
}));

export default useLeaveStore;
