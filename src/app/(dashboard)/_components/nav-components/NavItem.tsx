import Link from "next/link";
import React from "react";
import Home from "@/assets/Home";
import { NavItem } from "@types";
import { usePathname } from "next/navigation";

const NavItems = ({
  item = { title: "Home", icon: Home, link: "/" },
}: {
  item: NavItem;
}) => {
  const pathname = usePathname();
  const isActive = pathname === item.link;

  return (
    <Link
      href={item.link}
      className={`py-6 px-3 relative ${
        isActive ? "text-white" : "text-secondary-200"
      } hover:text-white transition-all flex gap-[6px] items-center justify-center font-semibold text-base leading-160`}
    >
      {item.icon && <item.icon color="currentColor" />}
      {item.title}
      <span
        className={`inline-block w-full h-[3px] absolute transition-colors ${
          isActive ? "bg-main-400" : "bg-transparent"
        } rounded left-0 bottom-0`}
      ></span>
    </Link>
  );
};

export default NavItems;
