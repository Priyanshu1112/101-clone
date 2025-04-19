"use client";
import React, { useEffect, useRef } from "react";
import TopNav from "./nav-components/TopNav";
import BottomNavLeave from "./nav-components/BottomNavLeave";
import { usePathname } from "next/navigation";
import BottomNavTeam from "./nav-components/BottomNavTeam";
import useAppStore from "@/store/app";

const Navigation = () => {
  const pathName = usePathname(); // Get current path
  const navbarRef = useRef<HTMLElement>(null); // Ref for nav element
  const { setNavbarHeight } = useAppStore(); // Store action to set height

  useEffect(() => {
    if (navbarRef.current) {
      // Calculate and set the height of the navbar
      setNavbarHeight(navbarRef.current.offsetHeight);
    }
  }, [pathName, setNavbarHeight]); // Trigger on pathName changes

  return (
    <nav
      className="w-full bg-secondary-400 sticky top-0 left-0 z-50"
      ref={navbarRef}
    >
      <TopNav />
      <hr className="border-[#FFFFFF2E]" />
      {pathName === "/leaves" && <BottomNavLeave />}
      {pathName === "/team" && <BottomNavTeam />}
    </nav>
  );
};

export default Navigation;
