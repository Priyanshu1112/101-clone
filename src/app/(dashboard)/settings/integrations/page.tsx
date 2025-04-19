"use client"
import React, { useState } from "react";
import Tabs from "./_components/Tabs";
import PreferencesPanel from "./_components/PreferencesPanel";

const IntegrationsPage = () => {
  const [activeTab, setActiveTab] = useState("Calendar"); // Default tab

  return (
    <div
      className="p-8 bg-white rounded-lg border border-[#D0D5DD] shadow-[0px_4px_6px_-2px_#10182805,0px_12px_16px_-4px_#1018280A]"
    >
      <Tabs activeTab={activeTab} onTabChange={setActiveTab} />
      <PreferencesPanel activeTab={activeTab} />
    </div>
  );
};

export default IntegrationsPage;