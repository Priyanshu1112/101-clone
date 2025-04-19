import { FormItem, FormLabel } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

const CustomFormItem = ({
  children,
  className,
  label,
}: {
  children?: ReactNode;
  className?: string;
  label?: string;
}) => {
  return (
    <FormItem className={cn("flex flex-col gap-[6px] w-full", className)}>
      <FormLabel className="text-sm font-semibold text-grey/400">
        {label}
      </FormLabel>
      {children}
    </FormItem>
  );
};

export default CustomFormItem;
