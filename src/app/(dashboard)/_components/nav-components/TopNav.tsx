import { dropMenuItems, navItems } from "@/utils/constant/navigation";
import { NavItem as ItemType } from "@types";
import NavItems from "./NavItem";
import { Bell } from "lucide-react";
import { UserBg, UserCircleBg } from "@/assets/UserCircle";
import Logo from "@/assets/Logo";
import { calendarCodes } from "@/utils/constant/calendarCodes";
import useUserStore from "@/store/user";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Typography from "../Typography";
import DropMenuItem from "./DropMenuItem";
import { Fragment } from "react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Notifications from "../notification/Notifications";

const TopNav = () => {
  const { user, notifications } = useUserStore();

  return (
    <div id="upperNav" className="flex justify-between px-20">
      <span className="flex gap-4 justify-start">
        <span className="flex items-center text-secondary-100">
          <Logo />
        </span>
        <span className="flex">
          {navItems.map((item: ItemType, index: number) => {
            return <NavItems key={index} item={item} />;
          })}
        </span>
      </span>
      <span className="flex py-6 gap-1 items-center justify-center">
        <span className="p-2 text-secondary-200 cursor-pointer hover:text-white transition">
          <Sheet>
            <SheetTrigger className="relative">
              <Bell size={20} />
              {/* Red dot for unread notifications */}
              {(notifications?.length ?? 0) > 0 &&
                notifications?.find((notification) => !notification.isRead) && (
                  <div className="absolute top-0 right-0 w-2 h-2 bg-[#C84C09] rounded-full" />
                )}
            </SheetTrigger>
            <SheetContent className="flex flex-col gap-0 max-h-full min-w-[500px]">
              <SheetTitle>
                <Typography variant="display4" text="Notification" />
              </SheetTitle>
              <Notifications />
            </SheetContent>
          </Sheet>
        </span>
        {user?.colorCode ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none focus:ring-0">
              <UserCircleBg code={calendarCodes[user?.colorCode]} />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="min-w-60">
              <DropdownMenuLabel className="px-3 py-4">
                <Typography
                  variant="paragraph3"
                  text={user.name ?? ""}
                  className="font-bold text-grey/500"
                />
                <Typography
                  variant="label"
                  text={user.email ?? ""}
                  className="font-bold text-grey/400"
                />
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {dropMenuItems.map((item, index) => {
                return (
                  <Fragment key={index}>
                    <DropMenuItem item={item} />
                    {[1, 4].includes(index) && <DropdownMenuSeparator />}
                  </Fragment>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <UserBg />
        )}
      </span>
    </div>
  );
};

export default TopNav;
