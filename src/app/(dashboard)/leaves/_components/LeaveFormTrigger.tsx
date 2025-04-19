import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import Typography from "../../_components/Typography";
import LeaveForm from "./LeaveForm";
import useAppStore from "@/store/app";

const LeaveFormTrigger = ({
  children,
  open = false,
  setOpen,
  date,
}: {
  children?: ReactNode;
  open?: boolean;
  setOpen?: Dispatch<SetStateAction<boolean>>;
  date?: string;
}) => {
  const [leaveSheetOpen, setLeaveSheetOpen] = useState(false);
  const [isTimeLeave, setIsTimeLeave] = useState(true);
  const { navbarHeight } = useAppStore();

  useEffect(() => {
    setLeaveSheetOpen(open);
  }, [open]);

  useEffect(() => {
    if (!leaveSheetOpen && setOpen) setOpen(false);
  }, [leaveSheetOpen]);

  return (
    <Sheet
      open={leaveSheetOpen}
      onOpenChange={(e) => {
        setLeaveSheetOpen(e);

        if (setOpen) setOpen(e);
      }}
    >
      <SheetTrigger>{children}</SheetTrigger>
      <SheetContent className="p-0 min-w-fit flex flex-col">
        <SheetTitle className="py-5 px-6 flex items-center border-gray-300 border-b">
          <Typography variant="display4" text={"Apply leave"} />
        </SheetTitle>
        <div
          id="container"
          className="px-5 py-7 flex-1 flex flex-col overflow-auto"
          style={{ height: `calc(100dvh-${navbarHeight}px)` }}
        >
          <div className="flex relative py-1">
            <span
              className={`px-4 cursor-pointer  `}
              onClick={() => setIsTimeLeave(true)}
            >
              <Typography
                variant="paragraph1"
                text={"Time off"}
                className={`${!isTimeLeave && "text-grey/400"} font-bold `}
              />
            </span>
            <span
              onClick={() => setIsTimeLeave(false)}
              className={`px-4 cursor-pointer`}
            >
              <Typography
                variant="paragraph1"
                text={"Comp off"}
                className={`${isTimeLeave && "text-grey/400"} font-bold`}
              />
            </span>
            <div className="w-full h-[3px] bg-[#D0D5DD] rounded absolute bottom-0 left-0 overflow-hidden">
              <div
                className={`h-full bg-secondary-400 w-[104px] rounded absolute transition-all ${
                  isTimeLeave ? "left-0" : "left-[104px]"
                }`}
              />
            </div>
          </div>
          <LeaveForm
            isTimeLeave={isTimeLeave}
            setOpen={setLeaveSheetOpen}
            start={date}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default LeaveFormTrigger;
