import {
  Company,
  LeaveStatus,
  LeaveTime,
  User as PrismaUser,
  TeamUser,
  User,
} from "@prisma/client";
import { LucideIcon } from "lucide-react";
import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface CustomTeam {
    id: string;
    name: string;
    leads: Array<{
      id: string;
      name: string;
      email: string;
      slackId: string | null;
    }>;
  }

  interface CustomTeamUser extends TeamUser {
    team: { name: string };
  }

  interface CustomLeadTeam extends CustomTeam {
    members: User[] | null;
  }

  interface Members {
    role: string;
    teamId: string;
    userId: string;
    team: { name: string; workDay: { workWeek?: number }[] };
    user: {
      name: string;
      googleId: string | null;
      slackId: string | null;
      gender: string | null;
    };
  }

  interface CustomUser extends PrismaUser {
    teamUsers?: CustomTeamUser[] | null;
    company?: Company | null;
    members?: Members[] | null;
    approver: { id: string; name: string } | null;
  }

  interface Session {
    accessToken?: string; // Add accessToken to Session
    user: CustomUser;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string; // Add accessToken to JWT type
  }
}

export interface SlackAPIError {
  data?: {
    error?: string;
  };
  message?: string;
}

export interface NavItem {
  icon: ComponentType<React.SVGProps<SVGSVGElement>>; // Ensures that the icon is a valid React component (like Home)
  title: string;
  link: string;
}

export type CommandHandler = (
  payload: unknown
) => Promise<{ response_type: string; text: string }>;

export type leave = {
  menstrual: number;
  paid: number;
  sick: number;
  bereavement: number;
  comp: number;
};

export type SlackInteractiveUser = {
  id: string;
  username: string;
  name: string;
  team_id: string;
};

export interface Event {
  id?: string;
  startTime?: LeaveTime;
  endTime?: LeaveTime;
  occasion: string;
  date: string;
  start: string;
  end: string;
  type: EventType;
  calendarId?: string;
  colorCode?: number;
  name: string;
  leaveName?: string;
  reason?: string;
  status?: LeaveStatus | string;
}

export enum EventType {
  LEAVE,
  HOLIDAY,
}

// types/leave.d.ts
declare module "@prisma/client" {
  // Create a new type that includes the 'type' field
  export interface FormattedLeaves extends Omit<LeaveRecord, "type"> {
    type: EventType; // or more specific type if required
    title: string;
    colorCode: number;
  }
}

export type MenuIcon =
  | {
      icon: LucideIcon | React.ComponentType<{ size?: number }>;
      title: string;
      link: string?;
      isAdmin?: boolean;
    }
  | { separator: boolean };

export interface LeaveSummary {
  day: string;
  time: string;
  channel: string;
}
