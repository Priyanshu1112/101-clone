import React from "react";
import { CircleUser } from "lucide-react";
import Typography from "@/app/(dashboard)/_components/Typography";
import {
  Sheet,
  SheetContent,
  // SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const CreateTeamButton: React.FC = () => {
  return (
    <Sheet>
      <SheetTrigger className="px-4 py-2 rounded-md hover:bg-gray-200">
        <Typography
          variant="paragraph3"
          text="Create new team"
          className="font-semibold text-[#344054]"
        />
        <CircleUser size={18} color="#344054" />
      </SheetTrigger>
      <SheetContent className="p-0 min-w-[500px] flex flex-col overflow-y-auto overflow-x-hidden">
        hey
      </SheetContent>
    </Sheet>
  );
};

export default CreateTeamButton;
