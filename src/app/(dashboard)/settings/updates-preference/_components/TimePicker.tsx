import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "./AddEditUpdates";

interface TimePickerProps {
  value?: string;
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

interface Options {
  label: string;
  value: string;
}

const TimePicker: React.FC<TimePickerProps> = ({
  // value = "11:45 PM",
  form,
}) => {
  // Generate time options from 12:00 AM to 12:00 PM
  const generateTimeOptions = (): Options[] => {
    const options: Options[] = [];

    // First add 12 AM times
    for (let minutes = 0; minutes < 60; minutes += 15) {
      const label = `12:${minutes.toString().padStart(2, "0")} AM`;
      const value = `00:${minutes.toString().padStart(2, "0")}:00`;
      options.push({ label, value });
    }

    // Add 1 AM to 11 AM times
    for (let hour = 1; hour < 12; hour++) {
      for (let minutes = 0; minutes < 60; minutes += 15) {
        const label = `${hour}:${minutes.toString().padStart(2, "0")} AM`;
        const value = `${hour.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:00`;
        options.push({ label, value });
      }
    }

    // Add 12 PM times
    for (let minutes = 0; minutes < 60; minutes += 15) {
      const label = `12:${minutes.toString().padStart(2, "0")} PM`;
      const value = `12:${minutes.toString().padStart(2, "0")}:00`;
      options.push({ label, value });
    }

    // Add 1 PM to 11 PM times
    for (let hour = 1; hour < 12; hour++) {
      for (let minutes = 0; minutes < 60; minutes += 15) {
        const label = `${hour}:${minutes.toString().padStart(2, "0")} PM`;
        const value = `${(hour + 12).toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:00`;
        options.push({ label, value });
      }
    }

    return options;
  };

  const timeOptions = generateTimeOptions();

  const formatTimeForDisplay = (time24: string): string => {
    if (!time24) return "";
    const [hours, minutes] = time24.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    let hours12 = hours % 12;
    if (hours12 === 0) hours12 = 12;
    return `${hours12}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  return (
    <Select
      value={form.getValues("time")}
      onValueChange={(value) => form.setValue("time", value)}
    >
      <SelectTrigger className="w-full justify-start text-left font-normal [&>svg]:hidden text-grey/500">
        <SelectValue>
          {formatTimeForDisplay(form.getValues("time"))}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="w-[240px] p-0 overflow-y-auto max-h-[300px]">
        {timeOptions.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            className={`w-full justify-start font-normal ${
              form.watch("time") === option.value ? "bg-accent" : ""
            }`}
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default TimePicker;
