import type { Metadata } from "next";
import "./globals.css";
import { Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";
import Loader from "./(dashboard)/_components/Loader";

export const metadata: Metadata = {
  title: "101",
  description: "Leave management",
  icons: {
    icon: "/fav-icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="w-dvw max-h-dvh">
      <body className="w-full max-h-full overflow-x-hidden overflow-y-auto bg-[#FCFCFD]">
        <Suspense fallback={<Loader />}>{children}</Suspense>
        <Toaster />
      </body>
    </html>
  );
}
