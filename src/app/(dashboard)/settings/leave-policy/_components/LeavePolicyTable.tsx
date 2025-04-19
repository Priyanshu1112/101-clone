"use client";

import React, { Dispatch, SetStateAction, useEffect, useMemo } from "react";
import useLeaveStore from "@/store/leave";
import Typography from "@/app/(dashboard)/_components/Typography";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { AllowanceType, LeaveDetail, LeaveType, Role } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import AddEditLeave, { FormType } from "./AddEditLeave";
import useUserStore from "@/store/user";

export function renderStringWithEmoji(input) {
  const emojiRegex = /[a-f0-9]{4,5}/gi;

  return input?.replace(emojiRegex, (match) => {
    return String.fromCodePoint(parseInt(match, 16));
  });
}

// export function renderStringWithEmoji(input) {
//   const [emoji, text] = [
//     input.split(" ")[0],
//     input.split(" ").slice(1).join(" "),
//   ];

//   return (
//     <Typography variant="paragraph3" className="font-semibold flex gap-1">
//       <Emoji unified={emoji} size={16} /> {text}
//     </Typography>
//   );
// }

const LeavePolicyTable = ({
  type,
  setTotal,
}: {
  type: LeaveType;
  total?: number;
  setTotal?: Dispatch<SetStateAction<number>>;
}) => {
  const { user } = useUserStore();
  const [open, setOpen] = React.useState<boolean>(false);

  const { leavePolicy, fetchLeaveDetail } = useLeaveStore();
  const isDeductible = type == LeaveType.Deductible;

  useEffect(() => {
    const total = leavePolicy?.reduce((sum, row) => {
      if (type === LeaveType.Deductible && row.type === LeaveType.Deductible) {
        return sum + (row.allowance ?? 0);
      } else if (row.type === LeaveType.Non_Deductible) {
        return sum + (row.allowance ?? 0);
      }
      return sum;
    }, 0);

    if (setTotal) setTotal(total ?? 0);
  }, [leavePolicy, type, setTotal]);

  const columns: ColumnDef<LeaveDetail>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const value = renderStringWithEmoji(row.original.name);

        return value;
      },
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    ...(isDeductible
      ? [
          {
            accessorKey: "allowance",
            header: "Allowance",
            cell: ({ row }) => {
              const value = row.original.unlimited
                ? "Unlimited"
                : row.original.allowance +
                  " days/" +
                  (row.original.allowanceType == AllowanceType.Monthly
                    ? "month"
                    : "year");

              return <span className="whitespace-nowrap">{value}</span>;
            },
          },
        ]
      : []),
    {
      accessorKey: "needsApproval",
      header: "Requires Approval",
      cell: ({ row }) => {
        return row.original.needsApproval ? "Yes" : "No";
      },
    },
    ...(user?.role == Role.Administrator
      ? [
          {
            accessorKey: "action",
            header: "",
            cell: ({ row }) => {
              return (
                <button
                  onClick={() => {
                    setOpen(true);
                    fetchLeaveDetail(row.original.id);
                  }}
                  className="text-dark flex items-center gap-1 px-[14px] py-[10px] rounded-[8px] w-full"
                >
                  <Typography
                    text="Edit"
                    variant="paragraph3"
                    className="text-grey/400 font-semibold underline text-right w-full"
                  />
                </button>
              );
            },
          },
        ]
      : []),
  ];

  const getData = useMemo(() => {
    const data = leavePolicy?.filter((leave) => {
      if (isDeductible) return leave.type == LeaveType.Deductible;
      else return leave.type == LeaveType.Non_Deductible;
    });

    return data;
  }, [leavePolicy, isDeductible]);

  const table = useReactTable({
    data: getData!,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="border border-gray-200 rounded-b-lg overflow-hidden">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className="bg-grey-200 text-grey/400 hover:bg-grey-200"
            >
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : (
                      <Typography
                        text={
                          flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          ) as string
                        }
                        variant="paragraph3"
                        className="font-semibold whitespace-nowrap"
                      />
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="text-grey/400"
              >
                {row.getVisibleCells().map((cell) => {
                  return (
                    <TableCell key={cell.id} className="align-top p-3">
                      <Typography
                        text={
                          flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          ) as string
                        }
                        variant="paragraph3"
                        className="font-semibold"
                      />
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Sheet
        open={open}
        onOpenChange={(value) => {
          setOpen(value);
          // if (value) fetchLeaveDetail(row.original.id);
        }}
      >
        <SheetContent className="p-0 min-w-[500px] flex flex-col overflow-y-auto overflow-x-hidden">
          <AddEditLeave type={FormType.Edit} setOpen={setOpen} />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default LeavePolicyTable;
