"use client";
import SettingsMenu from "./_components/SettingsMenu";
import useUserStore from "@/store/user";
import { useEffect } from "react";
import useLeaveStore from "@/store/leave";
import useTeamStore from "@/store/team";
import useAppStore from "@/store/app";
import useUpdateStore from "@/store/update";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { fetchWorkDays } = useTeamStore();
  const { leavePolicy } = useLeaveStore();
  const { company, user } = useUserStore();
  const { getChannels, navbarHeight } = useAppStore();
  const { getUpdates } = useUpdateStore();

  useEffect(() => {
    if (company) {
      fetchWorkDays(company.id);

      getUpdates(company.id ?? "");
      getChannels();
    }
  }, [company, fetchWorkDays, getChannels, getUpdates, leavePolicy, user]);

  return (
    <div
      className="flex gap-9 overflow-y-auto overflow-x-hidden no-scrollbar w-full"
      style={{
        height: `calc(100dvh - ${navbarHeight + 56}px)`,
      }}
    >
      <SettingsMenu />
      <main className="w-full py-1 overflow-x-auto no-scrollbar">
        {children}
      </main>
    </div>
  );
}
