import React from "react";
import { TableRow, TableCell } from "@/components/ui/table"; // Assuming you have shadcn's Table component imported correctly

interface TeamMemberRowProps {
  name: string;
  email: string;
  approver: string;
  team: string;
}

const TeamMemberRow: React.FC<TeamMemberRowProps> = ({ name, email, approver, team }) => {
  return (
    <TableRow className="border border-[#EAECF0] ">
      <TableCell className="py-4 px-6">{name}</TableCell>
      <TableCell className="py-4 px-6 text-[#667085]">{email}</TableCell>
      <TableCell className="py-4 px-6">{approver}</TableCell>
      <TableCell className="py-4 px-6">{team}</TableCell>
    </TableRow>
  );
};

export default TeamMemberRow;