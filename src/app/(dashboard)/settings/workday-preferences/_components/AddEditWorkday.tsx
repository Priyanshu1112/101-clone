"use client";
import Typography from "@/app/(dashboard)/_components/Typography";
import { SheetTitle } from "@/components/ui/sheet";
import React, {
  Dispatch,
  SetStateAction,
  useMemo,
  useState,
} from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField } from "@/components/ui/form";
import CustomFormItem from "../../_components/CustomFormItem";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MemberSelect,
  TeamSelect,
} from "../../holiday-preferences/_components/FormComponents";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import useTeamStore from "@/store/team";
import { FetchStatus } from "@/store/leave";
import CustomDialog from "@/app/(dashboard)/_components/CustomDialog";

const WeekDay = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const getOrderedWeekDays = (startOfWeek: string): string[] => {
  const startIndex = WeekDay.findIndex(
    (day) => day.toLowerCase() === startOfWeek.toLowerCase()
  );
  return [...WeekDay.slice(startIndex), ...WeekDay.slice(0, startIndex)];
};

const formSchema = z.object({
  name: z.string(),
  workWeek: z.string(),
  startOfWeek: z.string(),
  weekOff: z.array(z.string()),
  team: z.string(),
  member: z.string().optional(),
});

const AddEditWorkday = ({
  isEdit = false,
  setOpen,
}: {
  isEdit?: boolean;
  setOpen?: Dispatch<SetStateAction<boolean>>;
}) => {
  const {
    addWorkDayStatus,
    addWorkDay,
    currentWorkday,
    updateWorkday,
    updateWorkdayStatus,
    deleteWorkday,
    deleteWorkdayStatus,
  } = useTeamStore();
  const [deleteOpen, setDeleteOpen] = useState(false);

  // useEffect(() => {
  //   resetStatus();
  //   // return () => resetStatus();
  // }, []);

  useMemo(() => {
    let toastId: string | number = "";
    if (addWorkDayStatus == FetchStatus.PENDING)
      toastId = toast.info("Adding workday!", { duration: Infinity });
    else if (addWorkDayStatus == FetchStatus.SUCCESS) {
      toast.dismiss(toastId);
      toast.success("Added workday successfully!");

      if (setOpen) setOpen(false);
    } else if (addWorkDayStatus == FetchStatus.ERROR) {
      toast.dismiss(toastId);
      toast.error("Error adding workday!");
    }
  }, [addWorkDayStatus, setOpen]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          name: currentWorkday?.name,
          workWeek: currentWorkday?.workWeek?.toString(),
          startOfWeek: currentWorkday?.startOfWeek,
          team: currentWorkday?.teamId,
          weekOff: currentWorkday?.weekOff as string[],
          member: "all",
        }
      : {
          name: "",
          workWeek: "",
          startOfWeek: WeekDay[0],
          team: "",
          weekOff: [],
          member: "all",
        },
  });

  const formData = form.watch();

  const validate = () => {
    const validation = formSchema.safeParse(formData);
    return validation.success;
  };

  const onAdd = async () => {
    if (validate()) {
      if ((formData.weekOff?.length ?? 0) + Number(formData.workWeek) !== 7) {
        return toast.error("The sum of week-off days and workweek should be 7");
      }

      await addWorkDay({
        member: formData.member,
        name: formData.name ?? "",
        startOfWeek: formData.startOfWeek ?? "",
        team: formData.team ?? "",
        weekOff: formData.weekOff ?? [],
        workWeek: formData.workWeek?.toString() ?? "",
      });
    } else toast.error("All fields are required to proceed!");
  };

  const onDelete = async () => {
    await deleteWorkday();

    if (deleteWorkdayStatus == FetchStatus.SUCCESS) {
      toast.success("Deleted workday successfully!");
      if (setOpen) setOpen(false);
    } else if (deleteWorkdayStatus == FetchStatus.ERROR) {
      toast.error("Error deleting successfully!");
    }
  };

  const onUpdate = async () => {
    if (validate()) {
      if ((formData.weekOff?.length ?? 0) + Number(formData.workWeek) !== 7) {
        return toast.error("The sum of week-off days and workweek should be 7");
      }

      await updateWorkday({
        id: currentWorkday?.id ?? "",
        member: formData.member,
        name: formData.name ?? "",
        startOfWeek: formData.startOfWeek ?? "",
        team: formData.team ?? "",
        weekOff: formData.weekOff ?? [],
        workWeek: formData.workWeek?.toString() ?? "",
      });

      if (updateWorkdayStatus == FetchStatus.SUCCESS) {
        toast.success("Updated workday successfully!");
        if (setOpen) setOpen(false);
      } else if (updateWorkdayStatus == FetchStatus.ERROR) {
        toast.error("Error updating successfully!");
      }
    } else toast.error("All fields are required to proceed!");
  };

  return (
    <>
      {" "}
      <SheetTitle className="pt-5 pl-6  sticky top-0 bg-white  border-b border-grey-300 pb-5">
        {isEdit ? (
          <Typography variant="display4">
            Edit {currentWorkday?.name} team
          </Typography>
        ) : (
          <Typography variant="display4" text={"Add new workday"} />
        )}
      </SheetTitle>
      <div className="px-6  pt-4 h-full">
        <Form {...form}>
          <form className="h-full flex flex-col">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <CustomFormItem label="Name" className="w-full">
                  <FormControl>
                    <Input className="" placeholder="Enter name" {...field} />
                  </FormControl>
                </CustomFormItem>
              )}
            />

            <div className="mt-5 flex items-center gap-5">
              <FormField
                control={form.control}
                name="workWeek"
                render={({ field }) => (
                  <CustomFormItem label="Workweek" className="w-full">
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value?.toString() ?? ""}
                    >
                      <FormControl>
                        <SelectTrigger className="px-[14px] py-[10px]">
                          <SelectValue placeholder="Select number of working days" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Array.from({ length: 7 }).map((_, index) => {
                          return (
                            <SelectItem
                              key={index}
                              value={(index + 1).toString()}
                            >
                              {index + 1} days
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </CustomFormItem>
                )}
              />
              <FormField
                control={form.control}
                name="startOfWeek"
                render={({ field }) => (
                  <CustomFormItem label="Start of the week" className="w-full">
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="px-[14px] py-[10px]">
                          <SelectValue
                            placeholder="Select start of week"
                            className="capitalize"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {WeekDay.map((data, index) => {
                          return (
                            <SelectItem
                              key={index}
                              value={data}
                              className="capitalize"
                            >
                              {data}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </CustomFormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="weekOff"
              render={({ field }) => {
                const selectedDays: string[] = Array.isArray(field.value)
                  ? field.value
                  : [];

                return (
                  <CustomFormItem
                    label="Select week-off"
                    className="w-full mt-5"
                  >
                    <FormControl>
                      <div className="flex gap-2 w-full justify-between">
                        {getOrderedWeekDays(formData.startOfWeek! ?? []).map(
                          (day: string) => {
                            return (
                              <div
                                key={day}
                                onClick={() => {
                                  if (selectedDays.includes(day)) {
                                    field.onChange(
                                      selectedDays.filter(
                                        (d: string) => d !== day
                                      )
                                    );
                                  } else {
                                    field.onChange([...selectedDays, day]);
                                  }
                                }}
                                className={`px-3 py-1 border rounded cursor-pointer shadow ${
                                  selectedDays.includes(day)
                                    ? "bg-main-400 border-main-400 text-secondary-400-main font-semibold"
                                    : "border-grey-300 text-grey/400"
                                }`}
                              >
                                {day.slice(0, 3)}
                              </div>
                            );
                          }
                        )}
                      </div>
                    </FormControl>
                  </CustomFormItem>
                );
              }}
            />

            <div className="mt-4">
              <TeamSelect form={form} />
              <MemberSelect form={form} />
            </div>

            <div className="flex-grow"></div>

            <div className="py-6 bg-white mt-11 flex gap-6 items-center sticky bottom-0 left-0">
              <hr className="absolute top-0 -left-6 min-h-1 border-grey-300 w-[500px]" />
              {isEdit ? (
                <>
                  <CustomDialog
                    open={deleteOpen}
                    setOpen={setDeleteOpen}
                    dialogHeadDesc={`Deleting the ${currentWorkday?.name} team workday preference may impact your entire team. This action is irreversible.`}
                    dialogHeadText="Are you sure?"
                    action={
                      <Button
                        className="py-3 px-[18px] flex-1 bg-error-300 text-white border-error-300 hover:bg-error-400"
                        type="button"
                        onClick={onDelete}
                      >
                        Delete
                      </Button>
                    }
                  >
                    <Button
                      className="py-3 px-[18px] w-full bg-error-300 text-white border-error-300 hover:bg-error-400"
                      type="button"
                    >
                      Delete
                    </Button>
                  </CustomDialog>
                  <Button
                    onClick={onUpdate}
                    className="py-3 px-[18px] w-full bg-secondary-400-main text-main-400 border-secondary-400-main hover:bg-secondary-300"
                    type="button"
                  >
                    Confirm
                  </Button>
                </>
              ) : (
                <Button
                  onClick={onAdd}
                  className="py-3 px-[18px] w-full bg-secondary-400-main text-main-400 border-secondary-400-main hover:bg-secondary-300"
                  type="button"
                >
                  Add workday
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};

export default AddEditWorkday;
