import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { ChangeEvent, Dispatch, SetStateAction } from "react";

export enum Type {
  Search,
  Default,
}

interface Input {
  value?: string;
  setValue?: Dispatch<SetStateAction<string>>;
  onClick?: () => void;
  placeholder?: string;
  iconSize?: number;
  iconColor?: string;
  inputClass?: string;
  containerClass?: string;
  type?: Type;
}

const onChnage = (
  e: ChangeEvent<HTMLInputElement>,
  setValue: Dispatch<SetStateAction<string>> | undefined
) => {
  if (setValue) setValue(e.target.value);
};

export const Input = ({
  value,
  setValue,
  placeholder = "",
  iconSize = 16,
  iconColor = "#98A2B3",
  onClick = () => {},
  containerClass = "",
  inputClass = "",
  type = Type.Default,
}: Input) => {
  return (
    <div
      className={cn(
        "bg-white py-[10px] px-[14px] flex gap-2 items-center rounded-[8px] border border-grey-300",
        containerClass
      )}
      style={{
        boxShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
      }}
    >
      <input
        type="text"
        value={value}
        onChange={(e) => onChnage(e, setValue)}
        className={cn("flex-1 focus:outline-none placeholder:text-grey/350", inputClass)}
        placeholder={placeholder}
      />
      {type == Type.Search && (
        <Search
          size={iconSize}
          className="cursor-pointer"
          color={iconColor}
          onClick={onClick}
        />
      )}
    </div>
  );
};
