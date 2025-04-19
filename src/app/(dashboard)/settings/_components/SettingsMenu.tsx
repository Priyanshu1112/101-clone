"use client";
import { settingsMenu } from "@/utils/constant/settings";
import Typography from "../../_components/Typography";
import Link from "next/link";
import { MenuIcon } from "@types";
import LogOut from "./LogOut";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import useUserStore from "@/store/user";
import { Role } from "@prisma/client";

const SettingsMenu = () => {
  return (
    <div className="sticky top-0">
      <Typography variant="display4" text="Settings" />
      <div
        className="mt-5 w-[280px] px-[6px] py-[5px] border rounded-lg"
        style={{
          boxShadow: "0px 4px 6px -2px #10182808, 0px 12px 16px -4px #10182814",
        }}
      >
        {settingsMenu.map((menu, index) => {
          return <MenuItem key={index} item={menu} />;
        })}
      </div>
    </div>
  );
};

const MenuItem = ({ item }: { item: MenuIcon }) => {
  const pathName = usePathname();
  const { user } = useUserStore();

  if ("separator" in item) {
    return <div className="border border-[#EAECF0] my-1"></div>;
  }

  if (item.title === "Log out") {
    return <LogOut />;
  }

  if (user?.role !== Role.Administrator && "isAdmin" in item) return;

  return (
    <Link
      href={item.link!}
      className={cn(
        `text-grey/400 flex px-[10px] py-[9px] gap-2 items-center  rounded-lg transition-all`,
        pathName == item.link
          ? "bg-warning/100 text-grey/500"
          : "hover:bg-grey-200/50"
      )}
    >
      {item.icon && <item.icon size={16} />}
      <Typography
        text={item.title!}
        variant="paragraph3"
        className="font-semibold"
      />
    </Link>
  );
};

export default SettingsMenu;
