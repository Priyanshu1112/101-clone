import React from "react";
import Typography from "@/app/(dashboard)/_components/Typography";

interface ManageIntegartionButtonProps {
  label: string;
}

const ManageIntegrationButton: React.FC<ManageIntegartionButtonProps> = ({  }) => {
  return (
    <button
      className="px-6 py-3 border-2 border-[#D92D20] text-[#D92D20] rounded-lg hover:bg-red-50 transition-all"
    >
      <Typography
        text="Manage Integration"
        variant="paragraph1" // Use the existing paragraph1 variant
        className="font-bold leading-[28.8px] text-[18px] text-[#D92D20] font-['Mulish']"
      />
    </button>
  );
};

export default ManageIntegrationButton;