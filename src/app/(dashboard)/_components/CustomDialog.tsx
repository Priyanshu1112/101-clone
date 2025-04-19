"use client";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AlertCircle } from "lucide-react";
import OnboardBg from "@/app/(authentication)/_components/OnboardBg";
import {
  Dispatch,
  ReactElement,
  ReactNode,
  SetStateAction,
} from "react";
import Typography from "./Typography";

const CustomDialog = ({
  children,
  dialogHeadText,
  dialogHeadDesc,
  action,
  open,
  setOpen,
}: {
  children: ReactNode;
  dialogHeadText: string;
  dialogHeadDesc: string;
  action: ReactElement;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <Dialog open={open} onOpenChange={(value) => setOpen(value)}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="min-w-[400px]">
        <DialogTitle>
          <span className="relative">
            <span className="absolute -top-6 -left-6">
              <OnboardBg />
              <span className="absolute top-3 left-3 border-8 border-[#FEF3F2] rounded-full p-[14px] bg-error-100">
                <AlertCircle className="text-[#D92D20]" size={24} />
              </span>
            </span>
          </span>
        </DialogTitle>
        <div className="mt-8 py-4 px-6 relative z-10">
          <Typography
            text={dialogHeadText}
            variant="paragraph1"
            className="font-bold text-dark"
          />
          <Typography variant="paragraph3" className="text-grey/400 mt-1">
            {dialogHeadDesc}
          </Typography>
          <div className="mt-6 flex gap-3">
            <button
              onClick={() => setOpen(false)}
              className="py-[10px] px-4 flex-1 border border-grey-300 rounded-[8px]"
              style={{ boxShadow: "0px 1px 2px 0px #1018280D" }}
            >
              <Typography
                text="Cancel"
                variant="paragraph2"
                className="font-semibold text-grey/400"
              />
            </button>
            {/* <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="py-[10px] px-4 flex-1 border border-[#C84C09] rounded-[8px]"
              style={{ boxShadow: "0px 1px 2px 0px #1018280D" }}
            >
              <Typography
                text="Log out"
                variant="paragraph2"
                className="font-semibold text-[#C84C09]"
              />
            </button> */}
            {action}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomDialog;
