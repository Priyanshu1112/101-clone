import React from "react";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

interface FormInputFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  inputClassName?: string;
  disabled?: boolean;
}

const FormInputField: React.FC<FormInputFieldProps> = ({
  name,
  label,
  placeholder,
  type = "text",
  inputClassName = "",
  disabled,
}) => {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-sm text-gray-700 font-medium">
            {label}
          </FormLabel>
          <FormControl>
            <input
              disabled={name == "email" || !disabled}
              type={type}
              placeholder={placeholder}
              className={`w-full p-2 border disabled:cursor-not-allowed disabled:bg-grey-200 disabled:text-grey/400 rounded-md border-gray-300 text-gray-900 focus:ring-2 focus:ring-gray-400 focus:outline-none ${inputClassName}`}
              {...field}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default FormInputField;
