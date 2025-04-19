import CalendarTick from "@/assets/CalendarTick";
import Home from "@/assets/Home";
import MessageTextCircle from "@/assets/MessageTextCircle";
import UserCircle from "@/assets/UserCircle";
import { ZapFast } from "@/assets/ZapCircle";
import {
  BookOpen,
  HelpCircle,
  LogOut,
  Settings,
  UserRound,
} from "lucide-react";

export const navItems = [
  {
    icon: Home,
    title: "Home",
    link: "/",
  },
  {
    icon: CalendarTick,
    title: "Leaves",
    link: "/leaves",
  },
  {
    icon: MessageTextCircle,
    title: "Updates",
    link: "/updates",
  },
  {
    icon: UserCircle,
    title: "Team",
    link: "/team",
  },
];

export const dropMenuItems = [
  {
    icon: UserRound,
    title: "View profile",
    link: "/profile",
  },
  {
    icon: Settings,
    title: "Settings",
    link: "/settings/edit-profile",
  },
  {
    icon: ZapFast,
    title: "Changelog",
    link: "/changelog",
  },
  {
    icon: BookOpen,
    title: "Knowledge base",
    link: "/knowledge",
  },
  {
    icon: HelpCircle,
    title: "Support",
    link: "/support",
  },
  {
    icon: LogOut,
    title: "Log out",
    link: "/log-out",
  },
];
