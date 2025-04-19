import { FetchStatus } from "@/store/leave";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

export const toastPending = (message?: string) =>
  toast.info(message ?? "Loading..", { duration: Infinity });

export const toastFullfilled = (
  taostId: string | number,
  res: FetchStatus,
  success: string,
  error: string,
  setOpen?: Dispatch<SetStateAction<boolean>>
) => {
  toast.dismiss(taostId);
  if (res == FetchStatus.SUCCESS) {
    toast.success(success);
    if (setOpen) setOpen(false);
  } else toast.error(error);
};
