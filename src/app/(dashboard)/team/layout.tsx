"use client";

import useTeamStore from "@/store/team";
import TeamBox from "./_components/TeamBox";

import useAppStore from "@/store/app";
import Loader from "../_components/Loader";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { navbarHeight } = useAppStore();
  const { teams } = useTeamStore();

  return (
    <div
      className="flex gap-9 overflow-auto no-scrollbar"
      style={{
        height: `calc(100dvh - ${navbarHeight + 56}px)`,
      }}
    >
      {teams ? (
        <>
          <main className="w-full py-1">{children}</main>

          <div
            className="sticky top-0 h-screen"
            style={{
              height: `calc(100vh - ${navbarHeight}px)`,
            }}
          >
            <TeamBox isAllTeams={true} />
          </div>
        </>
      ) : (
        <div className="w-full pt-32">
          <Loader />
        </div>
      )}
    </div>
  );
}
