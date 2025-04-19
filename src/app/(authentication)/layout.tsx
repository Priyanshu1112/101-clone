"use client";
import useUserStore from "@/store/user";
import { useEffect } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { getSession } = useUserStore();

  useEffect(() => {
    getSession();
  }, [getSession]);

  return (
    <div className="min-h-dvh  bg-no-repeat bg-right-bottom bg-[#FFF1E4] bg-onboard p-12 flex flex-col gap-8">
      {children}
    </div>
  );
}
