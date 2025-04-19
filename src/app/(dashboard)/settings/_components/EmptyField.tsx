import React, { Dispatch, SetStateAction } from "react";
import Typography from "../../_components/Typography";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LucideIcon } from "lucide-react";

const EmptyField = ({
  title,
  supportText,
  message,
  buttonText,
  Icon,
  content,
  open,
  setOpen,
}: {
  title: string;
  supportText: string;
  message: string;
  buttonText: string;
  Icon: LucideIcon;
  content: React.ReactNode;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <div
      className="rounded-[12px]  w-full px-6 py-5 border border-grey-200 overflow-x-hidden"
      style={{
        boxShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
      }}
    >
      <span className="block pb-5">
        <Typography
          text={title}
          variant="paragraph1"
          className="font-bold text-grey/500"
        />
        <Typography
          variant="label"
          text={supportText}
          className="text-grey/400"
        />
      </span>
      <div className="pt-5 flex justify-center relative">
        <hr className="absolute top-0 -left-6 w-screen border-grey-200" />
        <Typography
          variant="paragraph2"
          className="font-semibold text-grey/400 flex items-center gap-3"
        >
          {message}
          <Sheet open={open} onOpenChange={(value) => setOpen(value)}>
            <SheetTrigger
              className="bg-brand/main text-dark flex items-center gap-1 hover:bg-brand/main/50 px-[14px] py-[10px] rounded-[8px] border border-brand/main"
              style={{
                boxShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
              }}
            >
              <Icon size={20} />
              <Typography
                text={buttonText}
                variant="paragraph3"
                className="font-semibold"
              />
            </SheetTrigger>
            <SheetContent className="p-0 min-w-[500px] flex flex-col overflow-y-auto overflow-x-hidden">
              {content}
            </SheetContent>
          </Sheet>
        </Typography>
      </div>
    </div>
  );
};

export default EmptyField;
