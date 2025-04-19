"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import FormInputField from "./FormInputField";
import ActionButtons from "./ActionButtons";
import useUserStore from "@/store/user";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import dayjs from "dayjs"; // Import dayjs
import customParseFormat from "dayjs/plugin/customParseFormat";
import {
  toastFullfilled,
  toastPending,
} from "@/app/(dashboard)/_components/Toast";
import {
  toastUpdating,
  toastUpdatingError,
  toastUpdatingSuccess,
} from "@/utils/constant/toastMessage";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import Typography from "@/app/(dashboard)/_components/Typography";

dayjs.extend(customParseFormat);

// 📝 Zod Schema
const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  workAnniversary: z.string(),
  birthdate: z.string(),
  email: z.string().email("Invalid email address"),
  gender: z.string(),
});

type FormData = z.infer<typeof formSchema>;

const EditProfileForm = () => {
  const { user, updateUser } = useUserStore();
  const [isEdit, setIsEdit] = useState(false);

  // Use dayjs to format and parse dates
  const defaultValues = {
    firstName: user?.name.split(" ")[0] ?? "",
    lastName: user?.name.split(" ").slice(1).join(" ") ?? "",
    workAnniversary: user?.workAnniversary ?? "",
    birthdate: user?.birthday ?? "",
    email: user?.email ?? "",
    gender: user?.gender ?? "",
  };

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const formData = form.watch();

  const { getValues, reset } = form;

  const onDiscard = () => {
    reset(defaultValues);
    form.setValue("gender", user?.gender?.toLocaleLowerCase() ?? "");
    setIsEdit(false);
  };

  const onSubmit = async () => {
    const isValid = formSchema.safeParse(formData);
    if (!isValid.success || !formData.birthdate || !formData.workAnniversary)
      return toast.error("All fields are necessary!");

    const toastId = toastPending(toastUpdating("User"));
    const res = await updateUser(user?.id ?? "", formData);
    toastFullfilled(
      toastId,
      res,
      toastUpdatingSuccess("User"),
      toastUpdatingError("User"),
      setIsEdit
    );
  };

  return (
    <div className="p-6 bg-white rounded-lg w-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-2 gap-x-6 gap-y-4"
        >
          {/* First and Last Name */}
          <FormInputField
            name="firstName"
            label="First name"
            placeholder={getValues("firstName")}
            disabled={isEdit}
          />
          <FormInputField
            name="lastName"
            label="Last name"
            placeholder={getValues("lastName")}
            disabled={isEdit}
          />
          {/* Birthdate */}
          <FormField
            control={form.control}
            name="birthdate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Birthday</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground",
                          !isEdit &&
                            "text-grey/400 bg-grey-200 cursor-not-allowed"
                        )}
                      >
                        {field.value ? (
                          dayjs(field.value, "DD/MM/YYYY").format("MMM D, YYYY")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      {isEdit && (
                        <DateCalendar
                          value={
                            field.value
                              ? dayjs(field.value, "DD/MM/YYYY")
                              : dayjs()
                          }
                          onChange={(date) => {
                            // Store the value as DD/MM/YYYY
                            field.onChange(
                              date ? dayjs(date).format("DD/MM/YYYY") : ""
                            );
                          }}
                          // defaultValue={dayjs()}
                          minDate={dayjs("1900-01-01")}
                          maxDate={dayjs()}
                          views={["year", "month", "day"]}
                          sx={{
                            "& .MuiPickersDay-root.Mui-selected": {
                              backgroundColor: "#3D4630", // Green background for the selected date
                              color: "#FAFF7D", // White text for contrast
                            },
                          }}
                        />
                      )}
                    </LocalizationProvider>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Work Anniversary */}
          <FormField
            control={form.control}
            name="workAnniversary"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Work Anniversary</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground",
                          !isEdit &&
                            "text-grey/400 bg-grey-200 cursor-not-allowed"
                        )}
                      >
                        {field.value ? (
                          // Format the field value correctly as MMM D, YYYY
                          dayjs(field.value, "DD/MM/YYYY").format("MMM D, YYYY")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      {isEdit && (
                        <DateCalendar
                          value={
                            field.value
                              ? dayjs(field.value, "DD/MM/YYYY")
                              : dayjs()
                          }
                          onChange={(date) => {
                            console.log({ date });
                            // Store the value as DD/MM/YYYY
                            field.onChange(
                              date ? dayjs(date).format("DD/MM/YYYY") : ""
                            );
                          }}
                          // defaultValue={dayjs()}
                          minDate={dayjs("1900-01-01")}
                          maxDate={dayjs()}
                          views={["year", "month", "day"]}
                          sx={{
                            "& .MuiPickersDay-root.Mui-selected": {
                              backgroundColor: "#3D4630", // Green background for the selected date
                              color: "#FAFF7D", // White text for contrast
                            },
                          }}
                        />
                      )}
                    </LocalizationProvider>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => {
              return (
                <FormItem className="flex flex-col pt-2">
                  <FormLabel>Gender</FormLabel>
                  <Select
                    disabled={!isEdit}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="py-[10px] px-[14px] disabled:bg-grey-200">
                        <Typography
                          text={field.value ? field.value : "Select gender"}
                          variant="paragraph2"
                          className="capitalize text-grey/400"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="text-grey/400">
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              );
            }}
          />

          {/* Email Field */}
          <FormInputField
            name="email"
            label="Your email address"
            placeholder={getValues("email")}
            inputClassName="bg-[#F9FAFB] text-gray-700 border-gray-200 cursor-text"
          />
          {/* Action Buttons */}
          <div className="col-span-2 flex justify-end space-x-4">
            <ActionButtons
              onDiscard={onDiscard}
              onSubmit={onSubmit}
              isEdit={isEdit}
              setIsEdit={setIsEdit}
            />
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EditProfileForm;
