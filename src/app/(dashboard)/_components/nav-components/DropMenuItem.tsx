"use client";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import Typography from "../Typography";
import Link from "next/link";
import { MenuIcon } from "@types";
import LogOut from "../../settings/_components/LogOut";
import useUserStore from "@/store/user";

const DropMenuItem = ({ item }: { item: MenuIcon }) => {
  const { user } = useUserStore();

  if ("separator" in item) return;

  if (item.title == "Log out") return <LogOut />;

  return (
    <Link
      href={
        item.title == "View profile"
          ? "/profile/" + (user?.id ?? "")
          : item.link!
      }
    >
      <DropdownMenuItem className="text-grey/400 px-3 py-2 cursor-pointer">
        <item.icon size={16} />{" "}
        <Typography
          text={item.title}
          variant="paragraph3"
          className=" font-semibold"
        />
      </DropdownMenuItem>
    </Link>
  );
};

export default DropMenuItem;
