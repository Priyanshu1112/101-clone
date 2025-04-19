import Typography from "@/app/(dashboard)/_components/Typography";
import { SheetContent, SheetTitle } from "@/components/ui/sheet";
import React, { Dispatch, SetStateAction, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField } from "@/components/ui/form";
import CustomFormItem from "../../_components/CustomFormItem";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateTimeOptions } from "./SlackSettings";
import { Calendar } from "@/components/ui/calendar";
import dayjs from "dayjs";
import { Sparkle } from "lucide-react";
import { Button } from "@/components/ui/button";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";
import { toast } from "sonner";
import advancedFormat from "dayjs/plugin/advancedFormat";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  toastFullfilled,
  toastPending,
} from "@/app/(dashboard)/_components/Toast";
import {
  toastUpdating,
  toastUpdatingError,
  toastUpdatingSuccess,
} from "@/utils/constant/toastMessage";
import useUserStore from "@/store/user";

dayjs.extend(advancedFormat);
dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);

export enum Frequency {
  Daily,
  Weekly,
  Fortnightly,
  Monthly,
}

export interface MotivationalMessage {
  on: boolean; // Whether the motivation feature is enabled
  time: string; // Time of the message (e.g., "09:00 AM")
  frequency: Frequency; // Selected frequency of motivation
  dayOfNotification?: string; // Selected days (MTWTFSS for weekly/fortnightly, or specific date for monthly)
  date?: string;
}

const formSchema = z.object({
  on: z.boolean(),
  date: z.string().min(1, { message: "Start before is required" }),
  dayOfNotification: z.string(),
  time: z.string().min(1, { message: "Time is required" }),
  frequency: z.string().min(1, { message: "Frequency is required" }),
});

const MotivationForm = ({
  motivation,
  setOpen,
}: {
  motivation: MotivationalMessage;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const { connectUpdateSlackNotification, company } = useUserStore();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      on: true,
      date: motivation?.date ?? dayjs().tz("Asia/Kolkata").format("YYYY-MM-DD"),
      dayOfNotification: motivation?.dayOfNotification ?? "",
      time: motivation?.time ?? "",
      frequency: motivation?.frequency ?? "Daily",
    },
  });

  const formData = form.watch();

  const summaryText = useMemo(() => {
    const text = (() => {
      const time = formData.time.toLocaleLowerCase();
      switch (formData.frequency) {
        case "Daily" as unknown as Frequency:
          return `<b>Daily</b>, <b>${formData.dayOfNotification
            .toLocaleLowerCase()
            .split(" ")
            .join("-")}</b> at <b>${time}</b>`;

        case "Fortnightly" as unknown as Frequency:
          return `<b>Fortnightly</b>, ie. after every 15 days from <b>${dayjs(
            formData.date,
            "YYYY-MM-DD"
          )
            .tz("Asia/Kolkata")
            .format("MMM D, YYYY")}</b> at <b>${time}</b>`;

        case "Weekly" as unknown as Frequency:
          return `<b>Weekly</b>, every week on <b>${formData.dayOfNotification}</b> at <b>${time}</b>`;

        case "Monthly" as unknown as Frequency:
          return `<b>Monthly</b>, every <b>${dayjs(
            formData.date,
            "YYYY-MM-DD"
          ).format("Do")}</b> date at <b>${time}</b>`;
      }
    })();

    return (
      text +
      " Motivational messages will be sent to your team members! <br/>Keep your team motivated!💪🏻  "
    );
  }, [formData]);

  const onSubmit = async () => {
    const updatedFormData = { ...formData };

    const validate = formSchema.safeParse(updatedFormData);

    // Optional: allow only this specific validation error to be bypassed
    if (validate.success) {
      if (
        ["Weekly", "Daily"].includes(formData.frequency as unknown as string) &&
        !formData.dayOfNotification
      ) {
        return toast.error("Invalid form!");
      }

      const toastId = toastPending(toastUpdating("Notification"));
      const res = await connectUpdateSlackNotification({
        companyId: company?.id ?? "",
        motivationNotification: updatedFormData,
      });

      toastFullfilled(
        toastId,
        res,
        toastUpdatingSuccess("Notification"),
        toastUpdatingError("Notification"),
        setOpen
      );
    } else {
      console.log(validate.error);
      toast.error("Invalid form!");
    }
  };

  return (
    <SheetContent className="p-0 min-w-[500px] flex flex-col overflow-y-auto overflow-x-hidden">
      <SheetTitle className="pt-4 pl-6 sticky top-0 bg-white border-b border-grey-300 pb-5 z-10">
        <Typography
          variant="display4"
          text={"Motivational Messages Settings"}
        />
      </SheetTitle>
      <div className="pt-8 px-6 relative h-full flex flex-col">
        <Form {...form}>
          <form>
            <FormField
              name="time"
              control={form.control}
              render={({ field }) => {
                return (
                  <CustomFormItem
                    label={`When do you want to send the quote?`}
                    className="mb-5"
                  >
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select.." />
                      </SelectTrigger>
                      <SelectContent>
                        {generateTimeOptions()?.map((time) => {
                          return (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </CustomFormItem>
                );
              }}
            />
            <FormField
              name="frequency"
              control={form.control}
              render={({ field }) => {
                return (
                  <CustomFormItem
                    label={" What would be the Frequency?"}
                    className="mb-5"
                  >
                    <Select
                      value={field.value?.toString()}
                      onValueChange={(e) => {
                        form.setValue("dayOfNotification", "");

                        field.onChange(e);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select.." />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(Frequency)
                          .filter(([key]) => isNaN(Number(key))) // Only "Daily", "Weekly", etc.
                          .map(([key]) => (
                            <SelectItem key={key} value={key.toString()}>
                              {key}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </CustomFormItem>
                );
              }}
            />
            {
              <FormField
                name="dayOfNotification"
                control={form.control}
                render={({ field }) => {
                  const [isDaily, isWeekly, isMonthly, isFortnightly] = [
                    formData.frequency == ("Daily" as unknown as Frequency),
                    formData.frequency == ("Weekly" as unknown as Frequency),
                    formData.frequency == ("Monthly" as unknown as Frequency),
                    formData.frequency ==
                      ("Fortnightly" as unknown as Frequency),
                  ];

                  const inputComponent = (() => {
                    if (isDaily)
                      return (
                        <Select
                          value={field.value}
                          onValueChange={(e) => {
                            field.onChange(e);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select days" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Every Weekday">
                              Every Weekday
                            </SelectItem>
                            <SelectItem value="Everyday">Everyday</SelectItem>
                          </SelectContent>
                        </Select>
                      );
                    else if (isWeekly) {
                      return (
                        <Select
                          value={field.value}
                          onValueChange={(e) => {
                            field.onChange(e);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a day" />
                          </SelectTrigger>
                          <SelectContent>
                            {dayjs.weekdays().map((day, index) => (
                              <SelectItem value={day} key={index}>
                                {day}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      );
                    } else if (isMonthly || isFortnightly)
                      return (
                        <Popover>
                          <PopoverTrigger className="w-full text-start rounded-lg border text-sm p-2">
                            {formData.date
                              ? dayjs(formData.date, "YYYY-MM-DD")
                                  .tz("Asia/Kolkata")
                                  .format("D MMM, YYYY")
                              : "Select a date"}
                          </PopoverTrigger>
                          <PopoverContent align="center">
                            <Calendar
                              mode="single"
                              selected={dayjs(
                                formData.date,
                                "YYYY-MM-DD"
                              ).toDate()}
                              onSelect={(date) => {
                                form.setValue(
                                  "date",
                                  dayjs(date).format("YYYY-MM-DD")
                                );
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                      );
                    else
                      return (
                        <Typography
                          variant="paragraph3"
                          className="text-grey/400"
                        >
                          Please select a frequency first.
                        </Typography>
                      );
                  })();

                  return (
                    <CustomFormItem
                      label={
                        isDaily
                          ? "Which days?"
                          : isWeekly
                          ? "Every week, which day?"
                          : isFortnightly
                          ? "Start date? Every 15days from start date"
                          : isMonthly
                          ? "Every month, which date?"
                          : ""
                      }
                      className="mt-1 flex  items-start"
                    >
                      {inputComponent}
                    </CustomFormItem>
                  );
                }}
              />
            }

            <div className="bg-main-100 p-3 rounded-[5px] border border-warning/400 mt-6 flex gap-3 items-start">
              <div>
                <Sparkle size={20} />
              </div>
              <Typography
                variant="paragraph2"
                className="text-grey/500"
                // dangerouslySetInnerHTML={{ __html: summaryText }}
              >
                {formData.on &&
                (["Weekly", "Daily"].includes(
                  formData.frequency as unknown as string
                )
                  ? formData.dayOfNotification
                  : formData.date) &&
                formData.time ? (
                  <span dangerouslySetInnerHTML={{ __html: summaryText }} />
                ) : (
                  "Select all the fields to continue!"
                )}
              </Typography>
            </div>
          </form>
        </Form>
        <div className="flex-grow"></div>

        <div className="sticky bottom-0 left-0 p-6 bg-white ">
          <hr className="h-1 w-screen absolute top-0 -left-8 bg-[#F9FAFB]" />
          <div className="flex gap-6">
            <Button
              onClick={() => setOpen(false)}
              style={{
                boxShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
              }}
              className="w-full bg-white text-grey/500 font-semibold border border-grey-300 hover:bg-white hover:text-grey/500"
            >
              Discard
            </Button>
            <Button
              onClick={onSubmit}
              className="w-full text-main-400 bg-secondary-400-main"
              style={{
                boxShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
              }}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </SheetContent>
  );
};

export default MotivationForm;
