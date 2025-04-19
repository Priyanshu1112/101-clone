import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import SwitchToggle from "./SwitchToggle";
import Typography from "@/app/(dashboard)/_components/Typography";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectValue,
} from "@/components/ui/select";
import PublicHolidayForm, { PublicHoliday } from "./PublicHolidayForm";
import useUserStore from "@/store/user";
import {
  toastFullfilled,
  toastPending,
} from "@/app/(dashboard)/_components/Toast";
import {
  toastUpdatingError,
  toastUpdatingSuccess,
} from "@/utils/constant/toastMessage";
import { Summary } from "./SlackSettings";
import MotivationForm, { MotivationalMessage } from "./MotivationForm";

interface NotificationOptionProps {
  state?: Summary;
  setState?: Dispatch<SetStateAction<Summary>>;
  label: string;
  description: string;
  isEnabled: boolean;
  showCustomizeButton?: boolean;
  dropdowns?: Array<{ label: string; options: string[]; isChannel?: boolean }>;
  publicHoliday?: boolean;
  motivationalMessage?: boolean;
}

const NotificationOption: React.FC<NotificationOptionProps> = ({
  state,
  setState,
  label,
  description,
  showCustomizeButton = false,
  dropdowns = [],
  publicHoliday = false,
  motivationalMessage = false,
}) => {
  const { company, connectUpdateSlackNotification } = useUserStore();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [upcomingHoliday, setUpcomingHoliday] = useState(false);
  const [motivationalMessages, setMotivationalMessages] = useState(false);
  const [isInit, setIsInit] = useState(false);
  const [isChanged, setIsChanged] = useState(false);

  const handleToggle = () => {
    if (publicHoliday) setUpcomingHoliday(!upcomingHoliday);
    else if (motivationalMessage)
      setMotivationalMessages(!motivationalMessages);
    else if (setState) {
      setState((prevState) => ({
        ...prevState,
        on: !prevState?.on,
      }));
    }

    setIsChanged(true);

    setTimeout(() => setIsChanged(false), 1500);
  };

  useEffect(() => {
    if (company) {
      setUpcomingHoliday(
        (company?.slackUpcomingHoliday as unknown as PublicHoliday)?.on ?? false
      );
      setMotivationalMessages(
        (company?.slackMotivationalMessage as unknown as MotivationalMessage)
          ?.on ?? false
      );

      setIsInit(true);
    }
  }, [company]);

  useEffect(() => {
    const handleNotification = async () => {
      const toastId = toastPending("Updating...");
      const res = await connectUpdateSlackNotification({
        companyId: company?.id ?? "",
        publicHolday: { on: upcomingHoliday },
        motivationNotification: { on: motivationalMessages },
      });

      toastFullfilled(
        toastId,
        res,
        toastUpdatingSuccess("Notification"),
        toastUpdatingError("Notification")
      );
    };

    if (isChanged && isInit) {
      handleNotification();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isChanged]);

  return (
    <div className="flex justify-between items-start border-b mt-0 border-[#EAECF0] py-5">
      {/* Left Section: Toggle and Text */}
      <div className="flex items-start space-x-4 flex-1">
        {/* Toggle */}
        <SwitchToggle
          isEnabled={
            publicHoliday
              ? upcomingHoliday ?? false
              : state?.on ?? motivationalMessages
              ? true
              : false
          }
          onToggle={handleToggle}
        />

        {/* Notification Text */}
        <div>
          <Typography
            text={label}
            variant="paragraph2"
            className="text-[#344054] fo  nt-semibold"
          />
          <Typography
            text={description}
            variant="paragraph3"
            className="text-[#667085] mt-1"
          />
        </div>
      </div>

      {/* Right Section: Dropdowns or Customize Button */}
      <div className="flex gap-4">
        {/* Dropdowns */}
        {dropdowns.map((dropdown, index) => (
          <div key={index} className="flex flex-col w-40">
            <Typography
              text={dropdown.label}
              variant="paragraph3"
              className="text-[#667085] mb-1 font-semibold"
            />
            <Select
              value={dropdown.isChannel ? state?.channel : state?.time}
              onValueChange={(e) => {
                if (setState)
                  if (dropdown.isChannel)
                    setState((prevState) => ({
                      ...prevState,
                      channel: e,
                    }));
                  else
                    setState((prevState) => ({
                      ...prevState,
                      time: e,
                    }));
              }}
            >
              <SelectTrigger className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring focus:ring-gray-400">
                <SelectValue
                  placeholder={
                    dropdown.isChannel ? "Select channel" : "Select time"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {dropdown.options.map((option, idx) => (
                  <SelectItem
                    key={idx}
                    value={dropdown.isChannel ? option.split("|")[0] : option}
                  >
                    {dropdown.isChannel ? option.split("|")[1] : option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}

        {/* Customize Button */}
        {showCustomizeButton && (
          <Sheet
            open={sheetOpen}
            onOpenChange={(value) => {
              setSheetOpen(value);
            }}
          >
            <SheetTrigger className="w-32 border border-gray-300 rounded-md px-4 py-2 text-gray-800 hover:bg-gray-100">
              <Typography
                text="Customize"
                variant="paragraph3"
                className="font-semibold text-[#344054]"
              />
            </SheetTrigger>

            {motivationalMessage ? (
              <MotivationForm
                motivation={
                  company?.slackMotivationalMessage as unknown as MotivationalMessage
                }
                setOpen={setSheetOpen}
              />
            ) : (
              <PublicHolidayForm
                setOpen={setSheetOpen}
                holiday={
                  company?.slackUpcomingHoliday as unknown as PublicHoliday
                }
              />
            )}
          </Sheet>
        )}
      </div>
    </div>
  );
};

export default NotificationOption;
