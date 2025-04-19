"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Typography from "@/app/(dashboard)/_components/Typography";
import { ChevronDown } from "lucide-react";
import {
  Input as CustomInput,
  Type,
} from "@/app/(dashboard)/_components/Input";
import { MembersList } from "./MembersList";
import { Dispatch, SetStateAction, useState } from "react";
import useAppStore from "@/store/app";

interface MembersDialogProps {
  members: string[];
  onToggle: (userId: string) => void;
  users: { id: string; name: string; email: string }[];
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
}

export const MembersDialog = ({
  members,
  onToggle,
  users,
  search,
  setSearch,
}: MembersDialogProps) => {
  const { allUsers } = useAppStore();
  const [open, setOpen] = useState(false);


  const getMembers = () => {
    const mem = allUsers
      ?.map((user) => (members.includes(user.id) ? user.name : false))
      .filter((name) => name);

    return mem?.join(",");
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) setSearch("");
        setOpen(value);
      }}
    >
      <DialogTrigger className="py-[10px] px-[14px] border border-grey-300 rounded-[8px] shadow-sm flex items-center">
        <Typography
          text={members.length > 0 ? getMembers() : "All"}
          variant="paragraph2"
          className="flex-1 text-start"
        />
        <ChevronDown size={16} />
      </DialogTrigger>
      <DialogContent className="px-[6px]  overflow-hidden pt-6 pb-2 rounded-[8px] border border-grey-300 bg-white shadow-sm">
        <DialogTitle />
        <CustomInput
          value={search}
          setValue={setSearch}
          type={Type.Search}
          placeholder="Search for members"
        />
        <MembersList
          users={users}
          selectedMembers={members}
          onToggle={onToggle}
          searchQuery={search}
        />
        <div className="relative py-3 px-2 flex justify-end gap-3 w-full">
          <hr className="h-1 w-screen absolute top-0 -left-[6px]" />
          <Button
            type="button"
            className="bg-white text-[#344054] border border-grey-300 shadow-sm font-semibold hover:bg-white"
          >
            Invite members
          </Button>
          <Button
            type="button"
            className="bg-secondary-400-main text-main-400 border border-secondary-400-main shadow-sm"
            onClick={() => setOpen(false)}
          >
            Confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
