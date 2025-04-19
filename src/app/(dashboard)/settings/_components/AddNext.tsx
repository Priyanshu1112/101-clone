"use client";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Plus } from "lucide-react";
import React, { ReactElement, ReactNode, useState } from "react";
import Typography from "../../_components/Typography";

const AddNext = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={(value) => setOpen(value)}>
      <SheetTrigger className="text-dark flex items-center gap-1 px-[14px] py-[10px] rounded-[8px]">
        <Plus size={20} />
        <Typography text="Add new" variant="paragraph3" className="font-bold" />
      </SheetTrigger>
      <SheetContent className="p-0 min-w-[500px] flex flex-col overflow-y-auto overflow-x-hidden">
        {React.isValidElement(children)
          ? React.cloneElement(children as ReactElement, { setOpen })
          : children}
      </SheetContent>
    </Sheet>
  );
};

export default AddNext;
