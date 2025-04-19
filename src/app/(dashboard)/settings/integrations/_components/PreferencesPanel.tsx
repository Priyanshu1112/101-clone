import React from "react";
import CalendarPreferences from "./CalendarPreferences";
import SlackPreferences from "./SlackPreferences";

interface PreferencesPanelProps {
  activeTab: string;
}

const PreferencesPanel: React.FC<PreferencesPanelProps> = ({ activeTab }) => {
  return (
    <div className=" bg-white rounded-lg   border-gray-200">
      {activeTab === "Calendar" && <CalendarPreferences />}
      {activeTab === "Slack" && <SlackPreferences />}
    </div>
  );
};

export default PreferencesPanel;