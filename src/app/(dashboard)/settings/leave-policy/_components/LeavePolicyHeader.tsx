"use client";
import React from "react";
import Typography from "@/app/(dashboard)/_components/Typography";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Plus } from "lucide-react";
import AddEditLeave, { FormType } from "./AddEditLeave";
import useUserStore from "@/store/user";
import { Role } from "@prisma/client";

interface LeavePolicyHeaderProps {
  title: string;
  linkText: string;
  type: FormType;
  total?: number;
}

const LeavePolicyHeader: React.FC<LeavePolicyHeaderProps> = ({
  title,
  linkText,
  type,
  total,
}) => {
  const [open, setOpen] = React.useState<boolean>(false);
  const { user } = useUserStore();

  return (
    <div className="p-4 mt-6 bg-gray-50 border border-gray-200 rounded-t-lg border-b-0 flex justify-between items-center">
      <div>
        <span className="flex items-center gap-2">
          <Typography
            text={title}
            variant="paragraph1"
            className="text-grey/500 font-bold"
          />
          {type == FormType.Deductible && (
            <Typography text={`(${total} days/year)`} variant="paragraph3" />
          )}
        </span>
        <a href="#" className="text-gray-500 underline text-sm">
          <Typography
            text={linkText}
            variant="label"
            className="text-grey/400"
          />
        </a>
      </div>
      {user?.role == Role.Administrator && (
        <Sheet open={open} onOpenChange={(value) => setOpen(value)}>
          <SheetTrigger className="text-dark flex items-center gap-1 px-[14px] py-[10px] rounded-[8px]">
            <Plus size={20} />
            <Typography
              text="Add new"
              variant="paragraph3"
              className="font-bold"
            />
          </SheetTrigger>
          <SheetContent className="p-0 min-w-[500px] flex flex-col overflow-y-auto overflow-x-hidden">
            <AddEditLeave type={type} setOpen={setOpen} />
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
};

export default LeavePolicyHeader;
