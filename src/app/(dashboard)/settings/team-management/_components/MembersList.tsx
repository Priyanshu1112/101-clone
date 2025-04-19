"use client";

import { Checkbox } from "@/components/ui/checkbox";
import Typography from "@/app/(dashboard)/_components/Typography";
import { useMemo } from "react";

interface MembersListProps {
  users: { id: string; name: string; email: string }[];
  selectedMembers: string[];
  onToggle: (userId: string) => void;
  searchQuery: string;
}

export const MembersList = ({
  users,
  selectedMembers,
  onToggle,
  searchQuery,
}: MembersListProps) => {
  const filteredUsers = useMemo(() => {
    return users?.filter(
      (user) =>
        user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div className="grid grid-cols-2 w-full">
      {filteredUsers
        ?.sort((a, b) => a.name.localeCompare(b.name))
        .map((user) => (
          <div
            key={user.id}
            className="flex items-center gap-2 py-[6px] px-2 cursor-pointer"
            onClick={() => onToggle(user.id)}
          >
            <Checkbox
              checked={selectedMembers.includes(user.id)}
              onCheckedChange={() => onToggle(user.id)}
              className="h-4 w-4 border border-grey-300 rounded pointer-events-none"
            />
            <Typography
              variant="paragraph2"
              className="capitalize text-grey/400"
              text={user.name}
            />
          </div>
        ))}
    </div>
  );
};
