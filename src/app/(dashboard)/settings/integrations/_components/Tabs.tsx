import React from "react";
import Typography from "@/app/(dashboard)/_components/Typography";

interface TabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex space-x-8 border-b border-gray-200 mb-6">
      {["Calendar", "Slack"].map((tab) => (
        <button
          key={tab}
          className="relative pb-2"
          onClick={() => onTabChange(tab)}
        >
          <Typography
            text={tab}
            variant="paragraph1"
            className={`${
              activeTab === tab
                ? "text-[#2F3724] font-semibold"
                : "text-gray-500"
            }`}
          />
          {activeTab === tab && (
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#2F3724]" />
          )}
        </button>
      ))}
    </div>
  );
};

export default Tabs;