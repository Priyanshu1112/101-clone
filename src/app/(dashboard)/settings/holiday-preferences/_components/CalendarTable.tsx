"use cliennt";
import React, { useMemo, useState } from "react";
import Typography from "@/app/(dashboard)/_components/Typography";
import useCalendarStore from "@/store/calendar";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import AddEditCalendar, { AddEditCalendarType } from "./AddEditCalendar";
import {
  toastFullfilled,
  toastPending,
} from "@/app/(dashboard)/_components/Toast";
import {
  toastDeleting,
  toastDeletingError,
  toastDeletingSuccess,
} from "@/utils/constant/toastMessage";

const holidayColumn = (
  action: boolean,
  deleteHoliday,
  local,
  deleteHolidayLocal
) => {
  const columns = [
    {
      accessorKey: "serial",
      header: "Sr. No.",
      cell: ({ row }) => <span>{row.index + 1}</span>,
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => (
        <span className="whitespace-nowrap">{row.original.date}</span>
      ),
    },
    {
      accessorKey: "occasion",
      header: "Occasion",
    },
  ];

  if (action) {
    columns.push({
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => (
        <button
          onClick={async (e) => {
            e.preventDefault();
            if (local) deleteHolidayLocal(row.original.id);
            else {
              const toastId = toastPending(toastDeleting("Holiday"));
              const res = await deleteHoliday(row.original.id);
              toastFullfilled(
                toastId,
                res,
                toastDeletingSuccess("Holiday"),
                toastDeletingError("Holiday")
              );
            }
          }}
          className="text-error-500 w-full flex justify-end"
        >
          <Trash2 size={20} />
        </button>
      ),
    });
  }

  return columns;
};

const calendarColumn = (holidayLength) => {
  return [
    {
      accessorKey: "country",
      header: "Calendar",
      cell: ({ row }) => {
        const flag = row?.original?.country?.split(" ")[0];
        return (
          <span className="whitespace-nowrap flex gap-2 items-center">
            <span
              className={cn(`flag flag:${flag}`)}
              style={{ width: "32px", height: "20px" }}
            ></span>
            {row?.original?.country?.split(" ")[1]}
          </span>
        );
      },
      className: "min-w-[3720px]",
    },
    {
      accessorKey: "_count.holiday",
      header: "No. of Holidays",
      cell: ({ row }) => (
        <span>{row.original._count?.holiday ?? holidayLength ?? 0}</span>
      ),
    },
    {
      accessorKey: "assignedTo",
      header: "Assigned to",
    },
    {
      accessorKey: "action",
      header: "",
    },
  ];
};

const CalendarTable = ({
  isCalendar,
  action = true,
  local = false,
}: {
  isCalendar: boolean;
  action?: boolean;
  local?: boolean;
}) => {
  const { holiday, calendar, deleteHoliday, deleteHolidayLocal } =
    useCalendarStore();

  const columns = useMemo(
    () =>
      isCalendar
        ? calendarColumn(holiday?.length)
        : holidayColumn(action, deleteHoliday, local, deleteHolidayLocal),
    [action, deleteHoliday, deleteHolidayLocal, holiday, isCalendar, local]
  );

  const calendarTable = useReactTable({
    data: calendar ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const holidayTable = useReactTable({
    data: holiday ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const table = isCalendar ? calendarTable : holidayTable;

  return (
    <div className="mt-5">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className="bg-grey-200 text-grey/400 hover:bg-grey-200"
            >
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    className={cn(header.id == "country" && "min-w-[372px]")}
                  >
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
        <TableBody className="min-h-fit">
          {table?.getRowModel()?.rows?.length ? (
            table?.getRowModel()?.rows.map((row) => {
              return (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="text-grey/400"
                >
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <TableCell key={cell.id} className="align-top p-3">
                        {isCalendar ? (
                          cell.column.id == "action" ? (
                            <Action calendarId={cell.row.original.id} />
                          ) : (
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
                          )
                        ) : (
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
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

const Action = ({ calendarId }: { calendarId: string }) => {
  const { setCurrentCalendar } = useCalendarStore();
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <Sheet
      open={sheetOpen}
      onOpenChange={async (value) => {
        if (value) {
          await setCurrentCalendar(calendarId);
        }
        setSheetOpen(value);
      }}
    >
      <SheetTrigger>
        <Typography
          text="View"
          className="font-semibold text-grey/400 underline"
          variant="paragraph3"
        />
      </SheetTrigger>
      <SheetContent className="p-0 min-w-[500px] flex flex-col overflow-y-auto overflow-x-hidden">
        <AddEditCalendar
          type={AddEditCalendarType.VIEW}
          setOpen={setSheetOpen}
        />
      </SheetContent>
    </Sheet>
  );
};

export default CalendarTable;
