import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface DropdownSelectProps {
  options: string[];
  defaultOption?: string;
  onSelect: (value: string) => void;
}

const DropdownSelect: React.FC<DropdownSelectProps> = ({
  options,
  defaultOption = "Select an option",
  onSelect,
}) => {
  const [selectedOption, setSelectedOption] = useState(defaultOption);
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full">
      <button
        className="w-full flex justify-between items-center border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-700"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {selectedOption}
        <ChevronDown className="w-5 h-5 text-gray-500" />
      </button>
      {isOpen && (
        <ul className="absolute z-10 bg-white border border-gray-300 rounded-lg mt-2 w-full shadow-lg">
          {options.map((option, index) => (
            <li
              key={index}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelect(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DropdownSelect;