import { UserCircleRectBg } from "@/assets/UserCircle";
import {
  CalendarPlus2,
  CircleArrowLeft,
  CircleArrowRight,
  ListFilter,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import useCalendarStore from "@/store/calendar";
import useUserStore from "@/store/user";
import useWorkdayStore from "@/store/workday";
import LeaveFormTrigger from "../../leaves/_components/LeaveFormTrigger";

const BottomNavLeave = () => {
  const {
    currentDate,
    isMonthlyView,
    hideWeekend,
    setCurrentDate,
    setIsMonthlyView,
    setHideWeekend,
    setOnlyMyLeaves,
    onlyMyLeaves,
  } = useCalendarStore();
  const { workday } = useWorkdayStore();
  const { user } = useUserStore();

  const currentHour = new Date().getHours();
  let greetingMessage = "Good Morning";

  if (currentHour >= 12 && currentHour < 16) {
    greetingMessage = "Good Afternoon";
  } else if (currentHour >= 16 || currentHour < 6) {
    greetingMessage = "Good Evening";
  }

  return (
    <div
      id="bottomNavLeave"
      className="flex justify-between items-center py-3 px-20"
    >
      <span className="flex items-center gap-2 opacity-0">
        <UserCircleRectBg />
        <span>
          <p className="text-sm leading-160 text-gray-300">{greetingMessage}</p>
          <p className="text-lg font-semibold leading-160 text-white capitalize">
            {user?.name}
          </p>
        </span>
      </span>
      <div className="flex gap-56 items-center">
        {/* SWTICH */}
        <div className="cursor-pointer border border-secondary-300 overflow-hidden  rounded-[30px]">
          <span
            onClick={() => setIsMonthlyView(false)}
            className={`${
              !isMonthlyView
                ? "bg-secondary-300 text-white"
                : "text-secondary-200"
            } inline-block text-sm py-4 pl-5 pr-4 font-semibold`}
          >
            Weekly
          </span>
          <span
            onClick={() => setIsMonthlyView(true)}
            className={`${
              isMonthlyView
                ? "bg-secondary-300 text-white"
                : "text-secondary-200"
            }  inline-block text-sm py-4 pl-5 pr-4 font-semibold`}
          >
            Monthly
          </span>
        </div>

        {/* CALENDAR */}
        <div className="flex text-secondary-300 gap-3 items-center">
          <button
            onClick={() => {
              // eslint-disable-next-line @typescript-eslint/no-unused-expressions
              isMonthlyView
                ? setCurrentDate(currentDate.subtract(1, "month"))
                : setCurrentDate(currentDate.subtract(1, "week"));
            }}
            className="hover:text-white transition"
          >
            <CircleArrowLeft size={24} />
          </button>
          <p className="text-sm font-semibold leading-160 text-white text-center w-[14ch]">
            {currentDate.format("MMMM YYYY")}
          </p>
          <button
            onClick={() => {
              // eslint-disable-next-line @typescript-eslint/no-unused-expressions
              isMonthlyView
                ? setCurrentDate(currentDate.add(1, "month"))
                : setCurrentDate(currentDate.add(1, "week"));
            }}
            className="hover:text-white transition"
          >
            <CircleArrowRight size={24} />
          </button>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="border text-secondary-200 p-2 rounded-md border-secondary-200 hover:border-white hover:text-white cursor-pointer transition-all">
                <ListFilter size={20} />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="py-1 px-2"
              side="bottom" // Position: "top", "bottom", "left", or "right"
              align="end" // Alignment: "start", "center", or "end"
              sideOffset={4} // Distance from the trigger
            >
              <DropdownMenuItem
                className="flex gap-2 items-center p-2 cursor-pointer"
                onClick={() => setHideWeekend(!hideWeekend)}
              >
                <Checkbox
                  className="rounded border-slate-300 size-5 "
                  checked={hideWeekend}
                />{" "}
                Hide Weekend (
                {workday?.weekOff.join(" & ") || "Saturday & Sunday"})
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex gap-2 items-center p-2 cursor-pointer"
                onClick={() => setOnlyMyLeaves(!onlyMyLeaves)}
              >
                <Checkbox
                  className="rounded border-slate-300 size-5 "
                  checked={onlyMyLeaves}
                />{" "}
                Only show my leaves
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
         
          <LeaveFormTrigger>
            <div className="bg-brand/main py-2 px-4 rounded-lg text-dark text-sm font-semibold leading-160 flex gap-[6px] items-center">
              Apply leave <CalendarPlus2 size={20} />
            </div>
          </LeaveFormTrigger>
        </div>
      </div>
    </div>
  );
};

export default BottomNavLeave;
