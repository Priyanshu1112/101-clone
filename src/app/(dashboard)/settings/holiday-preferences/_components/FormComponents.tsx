"use client";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import CustomFormItem from "../../_components/CustomFormItem";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { calendarId } from "@/utils/constant/calendarId";
import Typography from "@/app/(dashboard)/_components/Typography";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover } from "@radix-ui/react-popover";
import { PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import dayjs from "dayjs";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import useCalendarStore from "@/store/calendar";
import { Plus } from "lucide-react";
import useTeamStore from "@/store/team";
import { UseFormReturn } from "react-hook-form";

export const CountrySelect = ({ form, isView }) => {
  return (
    <FormField
      control={form.control}
      name="country"
      render={({ field }) => (
        <CustomFormItem label="Select Country">
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
            disabled={isView}
          >
            <FormControl>
              <SelectTrigger className="px-[14px] py-[10px]">
                <SelectValue placeholder="Select a country" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {Object.entries(calendarId).map(([key, value], index) => (
                <SelectItem value={`${key}-|-${value}`} key={index}>
                  <div className="flex items-center gap-2 ">
                    <span
                      className={cn(`flag flag:${key.split(" ")[0]} h-3 w-5`)}
                    ></span>
                    <Typography
                      variant="paragraph3"
                      className="text-grey-500 whitespace-nowrap"
                    >
                      {key.split(" ")[1]}
                    </Typography>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </CustomFormItem>
      )}
    />
  );
};

export const CurrentGeo = ({ form, isView, edit }) => {
  return (
    <FormField
      control={form.control}
      name="currentGeo"
      render={({ field }) => (
        <FormItem className="flex items-center gap-3 border-b border-grey-200 pb-1">
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={isView && !edit}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel>
              <Typography
                text="Calendar based on geography"
                variant="paragraph2"
                className="text-dark font-semibold pb-2"
              />
            </FormLabel>
          </div>
        </FormItem>
      )}
    />
  );
};

export const CustomCalendar = ({ form, isView, edit }) => {
  return (
    <FormField
      control={form.control}
      name="customCalendar"
      render={({ field }) => (
        <FormItem className="flex items-center gap-3">
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={isView && !edit}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel>
              <Typography
                text="Custom Calendar"
                variant="paragraph2"
                className="text-dark font-semibold pb-2"
              />
            </FormLabel>
          </div>
        </FormItem>
      )}
    />
  );
};

export const TeamSelect = ({
  form,
  isView,
  edit,
}: // edit,
{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
  isView?: boolean;
  edit?: boolean;
}) => {
  const { teams } = useTeamStore();

  return (
    <FormField
      control={form.control}
      name="team"
      render={({ field }) => (
        <CustomFormItem
          label={isView ? "Team" : "Select team"}
          className="mt-6"
        >
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
            disabled={!edit}
          >
            <FormControl>
              <SelectTrigger className="px-[14px] py-[10px]">
                <SelectValue placeholder="Select a team" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {teams?.map((team, index) => (
                <SelectItem value={team.id} key={index}>
                  <div className="flex items-center gap-2 ">
                    <Typography
                      variant="paragraph3"
                      className="text-grey-500 whitespace-nowrap"
                    >
                      {team.name}
                    </Typography>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </CustomFormItem>
      )}
    />
  );
};

export const MemberSelect = ({
  form,
  isView,
  edit,
}: // edit,
{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
  isView?: boolean;
  edit?: boolean;
}) => {
  return (
    <FormField
      control={form.control}
      name="member"
      render={({ field }) => (
        <CustomFormItem
          label={!isView ? "Select members (optional)" : "Members (optional)"}
          className="mt-5"
        >
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
            disabled={!edit}
          >
            <FormControl>
              <SelectTrigger className="px-[14px] py-[10px]">
                <SelectValue placeholder="Select members" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="all">
                <Typography
                  variant="paragraph3"
                  className="text-grey-500 whitespace-nowrap"
                >
                  All
                </Typography>
              </SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </CustomFormItem>
      )}
    />
  );
};

export const AddHoliday = ({
  // addStep,
  isView,
  // edit,
  className,
}: {
  addStep?: number;
  isView?: boolean;
  edit?: boolean;
  className?: string;
}) => {
  const { addHolidayLocal, addHoliday: addHolidayFn } = useCalendarStore();
  const [occasion, setOccasion] = useState("");
  const [holidayDate, setHolidayDate] = useState<Date>();
  const [addHoliday, setAddHoliday] = useState(false);

  return (
    <>
      {addHoliday && (
        <div className={cn("p-5 flex items-end gap-3", className)}>
          <span className="flex flex-col gap-1 flex-1">
            <Typography
              text="Choose date"
              variant="paragraph3"
              className="text-grey/400 font-semibold"
            />
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "justify-start text-left font-normal",
                    !holidayDate && "text-muted-foreground"
                  )}
                >
                  {holidayDate ? (
                    <Typography
                      variant="paragraph2"
                      className={"text-grey/500"}
                      text={dayjs(holidayDate).format("MMM D")}
                    />
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={new Date(holidayDate!)}
                  onSelect={(date) => {
                    setHolidayDate(new Date(date!));
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </span>
          <span className="flex flex-col gap-1 flex-1">
            <Typography
              text="Occasion"
              variant="paragraph3"
              className="text-grey/400 font-semibold"
            />
            <Input
              placeholder="Enter Occasion"
              value={occasion}
              onChange={(e) => setOccasion(e.target.value)}
              className="w-full"
            />
          </span>
          <Button
            type="button"
            className="max-w-fit px-[18px] py-3 bg-main-400 text-dark font-semibold hover:bg-main-400"
            onClick={() => {
              if (!occasion || !holidayDate) {
                toast.error("Both the fields are required!");
              } else {
                if (!isView) {
                  addHolidayLocal(holidayDate, occasion);
                } else {
                  addHolidayFn(holidayDate, occasion);
                }
                setAddHoliday(false);
              }
            }}
          >
            Confirm
          </Button>
        </div>
      )}

      <Button
        type="button"
        onClick={() => {
          setAddHoliday(!addHoliday);
        }}
        className="flex gap-[6px] items-center justify-center py-3 px-[18px] text-gray-700 hover:text-gray-700 hover:bg-grey-200 bg-white w-full border border-grey-300 shadow"
      >
        <Plus size={20} />
        <Typography text="Add new holiday" className="font-semibold" />
      </Button>
    </>
  );
};
