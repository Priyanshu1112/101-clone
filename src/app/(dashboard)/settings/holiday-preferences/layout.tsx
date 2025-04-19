
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className="flex w-full gap-9">{children}</div>;
}