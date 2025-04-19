import Typography from "@/app/(dashboard)/_components/Typography";
import { SheetContent, SheetTitle } from "@/components/ui/sheet";
import React, { Dispatch, SetStateAction } from "react";
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
import useAppStore from "@/store/app";
import { generateTimeOptions } from "./SlackSettings";
import { Sparkle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  toastUpdating,
  toastUpdatingError,
  toastUpdatingSuccess,
} from "@/utils/constant/toastMessage";
import useUserStore from "@/store/user";
import {
  toastFullfilled,
  toastPending,
} from "@/app/(dashboard)/_components/Toast";
import dayjs from "dayjs";

export interface PublicHoliday {
  on: boolean;
  channel: string;
  startBefore: string;
  dayOfNotification: string;
  time: string;
}

// Define form schema using Zod

const formSchema = (isMotivation: boolean) => {
  return z.object({
    channel: z.string().min(1, { message: "Channel is required" }),
    startBefore: z.string().min(1, { message: "Start before is required" }),
    dayOfNotification: z
      .string()
      .min(1, { message: "Day of notification is required" }),
    time: z.string().min(1, { message: "Time is required" }),
    ...(isMotivation && {
      frequency: z.string().min(1, { message: "Frequency is required" }),
    }),
  });
};
const PublicHolidayForm = ({
  holiday,
  setOpen,
}: {
  holiday?: PublicHoliday;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const { channels } = useAppStore();
  const { connectUpdateSlackNotification, company } = useUserStore();

  const form = useForm({
    resolver: zodResolver(formSchema(false)),
    defaultValues: {
      on: true,
      channel: holiday?.channel ?? "",
      startBefore: holiday?.startBefore ?? "",
      dayOfNotification: holiday?.dayOfNotification ?? "",
      time: holiday?.time ?? "",
    },
  });

  const getChannelName = (id: string) => {
    return channels?.find((channel) => channel.id == id)?.name;
  };

  const formData = form.watch();

  const onSubmit = async () => {
    const validate = formSchema(false).safeParse(formData);

    if (validate.success) {
      const toastId = toastPending(toastUpdating("Notification"));
      const res = await connectUpdateSlackNotification({
        companyId: company?.id ?? "",
        publicHolday: formData,
      });

      toastFullfilled(
        toastId,
        res,
        toastUpdatingSuccess("Notification"),
        toastUpdatingError("Notification"),
        setOpen
      );
    } else {
      toast.error("Invalid form!");
    }
  };

  return (
    <SheetContent className="p-0 min-w-[500px] flex flex-col overflow-y-auto overflow-x-hidden">
      <SheetTitle className="pt-4 pl-6 sticky top-0 bg-white border-b border-grey-300 pb-5 z-10">
        <Typography variant="display4" text={"Public holiday notifications"} />
      </SheetTitle>
      <div className="pt-8 px-6 relative h-full flex flex-col">
        <Form {...form}>
          <form>
            <FormField
              name="channel"
              control={form.control}
              render={({ field }) => {
                return (
                  <CustomFormItem label="Slack channel">
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select channel.." />
                      </SelectTrigger>
                      <SelectContent>
                        {channels?.map((channel) => {
                          return (
                            <SelectItem
                              key={channel.id}
                              value={channel.id ?? ""}
                            >
                              {channel.name}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </CustomFormItem>
                );
              }}
            />

            <hr className="w-full h-1 my-6" />
            <span>
              <Typography
                variant="paragraph2"
                className="text-grey/500 font-semibold"
                text="When do you want notifications?"
              />
              <FormField
                name="startBefore"
                control={form.control}
                render={({ field }) => {
                  return (
                    <CustomFormItem label="Start before" className="mt-1">
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select.." />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 7 })?.map((_, index) => {
                            return (
                              <SelectItem key={index} value={index + 1 + ""}>
                                {index + 1 < 2
                                  ? `${index + 1} week`
                                  : `${index + 1} weeks`}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                        <Typography
                          variant="paragraph3"
                          className="text-grey/400"
                          text="Choose how far in advance you would like to be notified about the public holiday based on your holiday list."
                        />
                      </Select>
                    </CustomFormItem>
                  );
                }}
              />
              <hr className="w-full h-1 my-6" />
              <FormField
                name="dayOfNotification"
                control={form.control}
                render={({ field }) => {
                  return (
                    <CustomFormItem
                      label="Day of the notifications"
                      className="mt-1"
                    >
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select.." />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 7 }, (_, i) =>
                            dayjs().day(i).format("dddd")
                          )?.map((day, index) => {
                            return (
                              <SelectItem key={index} value={day}>
                                {day}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </CustomFormItem>
                  );
                }}
              />
            </span>
            <hr className="w-full h-1 my-6" />
            <FormField
              name="time"
              control={form.control}
              render={({ field }) => {
                return (
                  <CustomFormItem
                    label={`Time of the notifications`}
                    className="mt-5"
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

            <div className="bg-main-100 p-3 rounded-[5px] border border-warning/400 mt-6 flex gap-3 items-start mb-10">
              <Sparkle size={20} />
              <Typography variant="paragraph2" className="text-grey/500 ">
                {formData.dayOfNotification &&
                formData.time &&
                getChannelName(formData.channel) &&
                formData.startBefore
                  ? `Every ${formData.dayOfNotification} at ${
                      formData.time
                    }, we will
                update you in #${getChannelName(formData.channel)} about any
                public holidays occurring within the next ${
                  formData.startBefore
                }
                weeks.`
                  : "Fill the details to continue!"}
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
              style={{ boxShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)" }}
              className="w-full bg-white text-grey/500 font-semibold border border-grey-300 hover:bg-white hover:text-grey/500"
            >
              Discard
            </Button>
            <Button
              onClick={onSubmit}
              className="w-full text-main-400 bg-secondary-400-main"
              style={{ boxShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)" }}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </SheetContent>
  );
};

export default PublicHolidayForm;
