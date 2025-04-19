
import Billing from "@/assets/BillingIcon";
import CalendarTick from "@/assets/CalendarTick";
import EditProfileIcon from "@/assets/EditProfileIcon";
import LeaveNotificationPreference from "@/assets/LeaveNotificationPreferenceIcon";
import TeamLeaveReport from "@/assets/TeamLeaveReportIcon";
import TeamManagementIcon from "@/assets/TeamManagementIcon";
import Umbrella from "@/assets/Umbrella";
import UpdatesNotificationPreferenceIcon from "@/assets/UpdatesNotificationPreferenceIcon";
import WorkdayPreferences from "@/assets/WorkdayPreferences";
import YourLeaveRecordsIcon from "@/assets/YourLeaveRecordsIcon";
import ZapCirlce from "@/assets/ZapCircle";
import { MenuIcon } from "@types";
import {
  
  FileText,
  
} from "lucide-react";

export const settingsMenu: MenuIcon[] = [
  // {
  //   icon: User,
  //   title: "Profile",
  //   link: "/settings/profile",
  // },
  {
    icon: EditProfileIcon,
    title: "Edit Profile",
    link: "/settings/edit-profile",
  },
  {
    icon: ZapCirlce,
    title: "Integrations",
    link: "/settings/integrations",
  },
  {
    icon: YourLeaveRecordsIcon,
    title: "Your leave records",
    link: "/settings/leave-record",
  },
  {
    separator: true,
  },
  {
    icon: CalendarTick,
    title: "Leave policy",
    link: "/settings/leave-policy",
  },
  {
    icon: UpdatesNotificationPreferenceIcon,
    title: "Updates preference",
    link: "/settings/updates-preference",
    isAdmin: true,
  },
  {
    icon: Umbrella,
    title: "Holiday preferences",
    link: "/settings/holiday-preferences",
  },
  {
    icon: LeaveNotificationPreference,
    title: "Leave notification preference",
    link: "/settings/leave-notification-preference",
  },
  {
    icon: TeamManagementIcon,
    title: "Team Management",
    link: "/settings/team-management",
    isAdmin: true,
  },
  {
    icon: WorkdayPreferences,
    title: "Workday preferences",
    link: "/settings/workday-preferences",
    isAdmin: true,
  },
  {
    icon: TeamLeaveReport,
    title: "Team leave report",
    link: "/settings/reports",
    isAdmin: true,
  },
  {
    icon: Billing,
    title: "Billing",
    link: "/settings/billing",
    isAdmin: true,
  },

  {
    separator: true,
  },
  {
    icon: FileText,
    title: "Log out",
    link: null,
  },
];
