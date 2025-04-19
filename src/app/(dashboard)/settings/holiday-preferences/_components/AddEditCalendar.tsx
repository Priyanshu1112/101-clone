"use client";
import Typography from "@/app/(dashboard)/_components/Typography";

import { SheetTitle } from "@/components/ui/sheet";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { Dispatch, SetStateAction, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import CustomDialog from "@/app/(dashboard)/_components/CustomDialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import useCalendarStore from "@/store/calendar";

import CalendarTable from "./CalendarTable";
import {
  AddHoliday,
  CountrySelect,
  CurrentGeo,
  CustomCalendar,
  MemberSelect,
  TeamSelect,
} from "./FormComponents";
import FlagText from "../../_components/FlagText";
import {
  toastFullfilled,
  toastPending,
} from "@/app/(dashboard)/_components/Toast";
import {
  toastAdding,
  toastAddingError,
  toastAddingSuccess,
  toastDeleting,
  toastDeletingError,
  toastDeletingSuccess,
  toastLoading,
  toastLoadingError,
  toastLoadingSuccess,
  toastUpdating,
  toastUpdatingError,
  toastUpdatingSuccess,
} from "@/utils/constant/toastMessage";
import useUserStore from "@/store/user";
import { Role } from "@prisma/client";
import { cn } from "@/lib/utils";

export enum AddEditCalendarType {
  ADD,
  VIEW,
}

const formSchema = z.object({
  country: z.string({ message: "Country is required!" }),
  currentGeo: z.boolean(),
  customCalendar: z.boolean(),
  team: z.string({ message: "Team is required" }),
  member: z.string().optional(),
});

const AddEditCalendar = ({
  type,
  setOpen,
}: {
  type: AddEditCalendarType;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const {
    fetchHoliday,
    currentCalendar,
    createCalendar,
    updateCalendar,
    deleteCalendar,
  } = useCalendarStore();
  const { user } = useUserStore();

  const [addStep, setAddStep] = useState(0);
  const [edit, setEdit] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);

  const isAdd = type == AddEditCalendarType.ADD;
  const isView = type == AddEditCalendarType.VIEW;

  const isMember = useMemo(
    () => !(user?.role == Role.Administrator || user?.role == Role.Owner),
    [user]
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: isAdd
      ? {
          currentGeo: false,
          customCalendar: false,
          country: "",
          team: "",
        }
      : {
          country:
            currentCalendar?.country + "-|-" + currentCalendar?.calendarId ||
            "",
          team: currentCalendar?.team?.id || "",
          currentGeo: false,
          customCalendar: false,
          member: "",
        },
  });

  const formData = form.watch();

  const validate = () => {
    const validation = formSchema.safeParse(formData);
    return validation.success;
  };

  const onSubmit = async () => {
    validate();

    if (isAdd) {
      if (addStep == 0) {
        if (!formData.country) return toast.error("Please select a country!");

        const toastId = toastPending(toastLoading("Holidays"));
        const res = await fetchHoliday(formData.country.split("-|-")[1]);
        toastFullfilled(
          toastId,
          res,
          toastLoadingSuccess("Holidays"),
          toastLoadingError("Holidays")
        );
        setAddStep(1);
      } else if (addStep == 1) {
        const toastId = toastPending(toastAdding("Calendar"));
        const res = await createCalendar(formData.country);
        toastFullfilled(
          toastId,
          res,
          toastAddingSuccess("Holidays"),
          toastAddingError("Holidays")
        );
        setAddStep(2);
      } else if (addStep == 2) {
        const toastId = toastPending(toastUpdating("Calendar"));
        const res = await updateCalendar({
          calendarId: currentCalendar?.id,
          teamId: formData.team as string,
        });
        toastFullfilled(
          toastId,
          res,
          toastUpdatingSuccess("Holidays"),
          toastUpdatingError("Holidays"),
          setOpen
        );
      }
    }
  };

  const onUpdate = async () => {
    const toastId = toastPending(toastUpdating("Calendar"));
    const res = await updateCalendar({
      calendarId: currentCalendar?.id ?? "",
      teamId: formData.team as string,
    });
    toastFullfilled(
      toastId,
      res,
      toastUpdatingSuccess("Calendar"),
      toastUpdatingError("Calendar"),
      setOpen
    );
  };

  const onDelete = async () => {
    const toastId = toastPending(toastDeleting("Calendar"));
    const res = await deleteCalendar();

    toastFullfilled(
      toastId,
      res,
      toastDeletingSuccess("Holidays"),
      toastDeletingError("Holidays"),
      setOpen
    );
  };

  return (
    <>
      <SheetTitle className="pt-4 pl-6 sticky top-0 bg-white border-b border-grey-300 pb-5 z-10">
        {isAdd ? (
          <Typography
            variant="display4"
            text={addStep == 1 ? "Update holiday list" : "Add new calendar"}
          />
        ) : !edit ? (
          <Typography variant="display4" text={"View Calendar"} />
        ) : (
          <FlagText
            pre="Edit"
            flagText={currentCalendar?.country ?? ""}
            after="calendar"
          />
        )}
      </SheetTitle>

      <div className="mt-8 px-6 h-full">
        <FormProvider {...form}>
          <form className="h-full flex flex-col">
            {isAdd && addStep == 0 && (
              <>
                <div className="p-5 rounded-[8px] border border-grey-300 flex flex-col gap-3">
                  <CurrentGeo form={form} isView={isView} edit={edit} />
                  <CountrySelect form={form} isView={isView} />
                </div>
                <div className="p-5 rounded-[8px] border border-grey-300 flex flex-col gap-3 mt-5">
                  <CustomCalendar form={form} isView={isView} edit={edit} />
                </div>
              </>
            )}

            {isAdd && addStep == 1 && (
              <>
                <FlagText
                  pre="Holiday list for"
                  flagText={formData.country}
                  after=""
                  className="text-grey/500 font-semibold pb-2 border-b border-grey-300 text-lg"
                />

                <CalendarTable isCalendar={false} local={true} />

                <div className="mt-12">
                  <AddHoliday isView={isView} edit={edit} />
                </div>
              </>
            )}

            {isAdd && addStep == 2 && (
              <>
                <FlagText
                  pre="Select members for"
                  flagText={formData.country}
                  after="calendar"
                  className="text-grey/500 font-semibold pb-2 border-b border-grey-300 text-lg"
                />
                <TeamSelect form={form} isView={isView} edit={true} />
                <MemberSelect form={form} isView={isView} edit={true} />
              </>
            )}

            {!isAdd && (
              <>
                {!isMember && (
                  <>
                    <div className="p-5 rounded-[8px] border border-grey-300 flex flex-col gap-3">
                      <CurrentGeo form={form} isView={isView} edit={edit} />
                      <CountrySelect form={form} isView={isView} />
                    </div>
                    <div className="p-5 rounded-[8px] border border-grey-300 flex flex-col gap-3 mt-5">
                      <CustomCalendar form={form} isView={isView} edit={edit} />
                    </div>
                  </>
                )}

                <>
                  <FlagText
                    pre="Holiday list for"
                    flagText={formData.country}
                    after=""
                    className={cn(
                      "text-grey/500 font-semibold pb-2 border-b border-grey-300 text-lg",
                      !isMember && "mt-12"
                    )}
                  />

                  {edit ? (
                    <CalendarTable isCalendar={false} />
                  ) : (
                    <CalendarTable isCalendar={false} action={false} />
                  )}
                </>

                <span className="mt-5">
                  {edit && <AddHoliday isView={isView} edit={edit} />}
                </span>

                {!isMember && (
                  <>
                    <FlagText
                      pre="Team & members for"
                      flagText={formData.country}
                      after="calendar"
                      className="text-grey/500 font-semibold pb-2 border-b border-grey-300 text-lg mt-12"
                    />

                    <TeamSelect form={form} isView={isView} edit={edit} />
                    <MemberSelect form={form} isView={isView} edit={edit} />
                  </>
                )}
              </>
            )}

            <div className="flex-grow"></div>

            <div className="py-6 bg-white mt-11 flex gap-6 items-center sticky bottom-0 left-0">
              <hr className="absolute top-0 -left-6 min-h-1 border-grey-300 w-[500px]" />
              {isView && edit && (
                <>
                  <CustomDialog
                    open={deleteOpen}
                    setOpen={setDeleteOpen}
                    dialogHeadDesc={`You're about to delete ${currentCalendar?.country} public holiday calendar.  This could change your leave policy. Remember, this action can't be undone.`}
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
              )}

              {isView && !edit && (
                <>
                  <Button
                    onClick={() => setOpen(false)}
                    className="py-3 px-[18px] w-full bg-secondary-white text-gray-700 border border-grey-300 hover:bg-secondary-100/80"
                    type="button"
                  >
                    Go Back
                  </Button>
                  {!isMember && (
                    <Button
                      onClick={() => setEdit(true)}
                      className="py-3 px-[18px] w-full bg-secondary-400-main text-main-400 border-secondary-400-main hover:bg-secondary-300"
                      type="button"
                    >
                      Edit
                    </Button>
                  )}
                </>
              )}

              {isAdd && (
                <Button
                  onClick={onSubmit}
                  className="py-3 px-[18px] w-full bg-secondary-400-main text-main-400 border-secondary-400-main hover:bg-secondary-300"
                  type="button"
                >
                  Confirm
                </Button>
              )}
            </div>
          </form>
        </FormProvider>
      </div>
    </>
  );
};

export default AddEditCalendar;
