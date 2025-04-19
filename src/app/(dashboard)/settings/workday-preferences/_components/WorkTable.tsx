"use client";
import React, { useState } from "react";
import Typography from "@/app/(dashboard)/_components/Typography";
import useTeamStore from "@/store/team";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Workday } from "@prisma/client";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import AddEditWorkday from "./AddEditWorkday";

function formatWeekDay(text: string): string {
  if (!text) return "";

  const firstChar = text.charAt(0).toUpperCase();
  const nextTwoChars = text.slice(1, 3).toLowerCase();

  return firstChar + nextTwoChars;
}

const WorkTable = () => {
  const { workDays, setCurrentWorkday } = useTeamStore();
  const [open, setOpen] = useState(false);

  const columns: ColumnDef<Workday>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    // {
    //   accessorKey: "assignedTo",
    //   header: "Assigned To",
    // },
    {
      accessorKey: "workWeek",
      header: "WorkWeek",
    },
    {
      accessorKey: "weekOff",
      header: "Week-off",
      cell: ({ row }) => {
        const weekOff = row.original.weekOff.map((day) => formatWeekDay(day));

        if (weekOff.length === 0) return ""; // No weekOff days
        if (weekOff.length === 1) return weekOff[0]; // Single day, return as is
        if (weekOff.length === 2) return weekOff.join(" & "); // Two days, join with '&'

        // More than two days
        const lastDay = weekOff.pop(); // Remove the last day
        return `${weekOff.join(", ")} & ${lastDay}`;
      },
    },

    {
      accessorKey: "startOfWeek",
      header: "Start of the week",
      cell: ({ row }) => {
        return formatWeekDay(row.original.startOfWeek);
      },
    },
    {
      accessorKey: "action",
      header: "",
      cell: ({ row }) => {
        return (
          <Sheet
            open={open}
            onOpenChange={(value) => {
              if (value) setCurrentWorkday(row.original.id);
              setOpen(value);
            }}
          >
            <SheetTrigger className="text-[#667085] flex items-center gap-1  rounded-[8px]">
              <Typography
                text="Edit"
                variant="paragraph3"
                className="font-semibold underline"
              />
            </SheetTrigger>
            <SheetContent className="p-0 min-w-[500px] flex flex-col overflow-y-auto overflow-x-hidden">
              <AddEditWorkday isEdit={true} setOpen={setOpen} />
            </SheetContent>
          </Sheet>
        );
      },
    },
  ];

  const table = useReactTable({
    data: workDays ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
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
        {table?.getRowModel()?.rows?.length ? (
          table?.getRowModel()?.rows?.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && "selected"}
              className="text-grey/400"
            >
              {row.getVisibleCells().map((cell) => {
                return (
                  <TableCell key={cell.id} className="align-top  p-3 px-4">
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
  );
};

export default WorkTable;
