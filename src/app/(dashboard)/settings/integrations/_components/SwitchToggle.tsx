import React from "react";

interface SwitchToggleProps {
  isEnabled: boolean;
  onToggle?: () => void;
}

const SwitchToggle: React.FC<SwitchToggleProps> = ({ isEnabled, onToggle }) => {
  return (
    <div
      onClick={onToggle}
      className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer ${
        isEnabled ? "bg-[#3D4630]" : "bg-gray-300"
      }`}
    >
      <div
        className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
          isEnabled ? "translate-x-5" : ""
        }`}
      />
    </div>
  );
};

export default SwitchToggle;