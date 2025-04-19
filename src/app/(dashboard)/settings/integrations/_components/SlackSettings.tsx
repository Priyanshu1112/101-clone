import React, { useEffect, useState, useCallback } from "react";
import Typography from "@/app/(dashboard)/_components/Typography";
import NotificationOption from "./NotificationOption";
import useAppStore from "@/store/app";
import useUserStore from "@/store/user";
import {
  toastFullfilled,
  toastPending,
} from "@/app/(dashboard)/_components/Toast";
import {
  toastUpdating,
  toastUpdatingSuccess,
  toastUpdatingError,
} from "@/utils/constant/toastMessage";
import { useDebounce } from "use-debounce"; // Add this package or implement your own debounce hook
import { PublicHoliday } from "./PublicHolidayForm";

export interface Summary {
  on: boolean;
  channel: string;
  time: string;
}

export const generateTimeOptions = () => {
  const times: string[] = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
      const formattedMinute = String(minute).padStart(2, "0");
      const period = hour < 12 ? "AM" : "PM";
      times.push(`${formattedHour}:${formattedMinute} ${period}`);
    }
  }
  return times;
};

const SlackSettings = () => {
  const { channels } = useAppStore();
  const { company, connectUpdateSlackNotification } = useUserStore();

  const [birthday, setBirthday] = useState<Summary>({
    on: false,
    channel: "",
    time: "",
  });
  const [workAnniversary, setWorkanniversary] = useState<Summary>({
    on: false,
    channel: "",
    time: "",
  });
  const [publicHoliday, setPublicHoliday] = useState<PublicHoliday>({
    on: false,
    channel: "",
    startBefore: "",
    dayOfNotification: "",
    time: "",
  });

  // Use debounced values instead of setTimeout
  const [debouncedBirthday] = useDebounce(birthday, 500);
  const [debouncedWorkAnniversary] = useDebounce(workAnniversary, 500);

  // Initialize state from company data
  useEffect(() => {
    if (company) {
      setBirthday(company.slackBirthday as unknown as Summary);
      setWorkanniversary(company.slackWorkanniversary as unknown as Summary);
      setPublicHoliday(
        company.slackUpcomingHoliday as unknown as PublicHoliday
      );
    }
  }, [company]);

  const getChannelName = useCallback(
    (id: string) => {
      return channels?.find((channel) => channel.id === id)?.name || "";
    },
    [channels]
  );

  // Memoize the update function to avoid recreation on each render
  const updateNotification = useCallback(
    async (type: "birthday" | "workanniversary", data: Summary) => {
      if (!company) return;

      const toastId = toastPending(toastUpdating("Notification"));

      const res = await connectUpdateSlackNotification({
        companyId: company.id,
        ...(type === "birthday" && { birthdayNotification: data }),
        ...(type === "workanniversary" && {
          workanniversaryNotification: data,
        }),
      });

      toastFullfilled(
        toastId,
        res,
        toastUpdatingSuccess("Notification"),
        toastUpdatingError("Notification")
      );
    },
    [company, connectUpdateSlackNotification]
  );

  // Single useEffect for birthday updates
  useEffect(() => {
    const companyBirthday = company?.slackBirthday as unknown as Summary;

    if (
      !company ||
      !debouncedBirthday?.on === undefined ||
      !debouncedBirthday?.channel ||
      !debouncedBirthday?.time ||
      (companyBirthday &&
        JSON.stringify(debouncedBirthday) === JSON.stringify(companyBirthday))
    ) {
      return;
    }

    updateNotification("birthday", debouncedBirthday);
  }, [debouncedBirthday, company, updateNotification]);

  // Single useEffect for work anniversary updates
  useEffect(() => {
    const companyWorkAnniversary =
      company?.slackWorkanniversary as unknown as Summary;

    if (
      !company ||
      debouncedWorkAnniversary?.on === undefined ||
      !debouncedWorkAnniversary?.channel ||
      !debouncedWorkAnniversary?.time ||
      (companyWorkAnniversary &&
        JSON.stringify(debouncedWorkAnniversary) ===
          JSON.stringify(companyWorkAnniversary))
    ) {
      return;
    }

    updateNotification("workanniversary", debouncedWorkAnniversary);
  }, [debouncedWorkAnniversary, company, updateNotification]);

  return (
    <div className="rounded-lg border border-[#F2F4F7] shadow-[0px_1px_2px_0px_#1018280D]">
      {/* Header Section */}
      <div className="p-6 bg-[#FCFCFD] rounded-t-lg border-b border-gray-200">
        <Typography
          text="Special notifications"
          variant="paragraph1"
          className="font-bold text-[18px] leading-[28.8px] text-gray-800"
        />
      </div>

      {/* Notification Options */}
      <div className="px-6 py-0">
        {/* Birthday Notification */}
        <NotificationOption
          state={birthday}
          setState={setBirthday}
          label="Birthdays"
          description={
            birthday?.channel && birthday?.time
              ? `Birthday notifications will be posted on #${getChannelName(
                  birthday.channel
                )} at ${birthday.time}`
              : "Configure birthday notifications"
          }
          isEnabled={true}
          dropdowns={[
            {
              isChannel: true,
              label: "Select channel",
              options:
                channels?.map((channel) => channel.id + "|" + channel.name) ||
                [],
            },
            { label: "Select time", options: generateTimeOptions() },
          ]}
        />

        {/* Work Anniversary Notification */}
        <NotificationOption
          state={workAnniversary}
          setState={setWorkanniversary}
          label="Work anniversary"
          description={
            workAnniversary?.channel && workAnniversary?.time
              ? `Work anniversary notifications will be posted on #${getChannelName(
                  workAnniversary?.channel
                )} at ${workAnniversary?.time}`
              : "Configure work anniversary notifications"
          }
          isEnabled={true}
          dropdowns={[
            {
              isChannel: true,
              label: "Select channel",
              options:
                channels?.map((channel) => channel.id + "|" + channel.name) ||
                [],
            },
            { label: "Select time", options: generateTimeOptions() },
          ]}
        />

        {/* Upcoming Public Holidays Notification */}
        <NotificationOption
          label="Upcoming public holidays"
          description={
            publicHoliday?.dayOfNotification &&
            publicHoliday?.time &&
            getChannelName(publicHoliday?.channel) &&
            publicHoliday?.startBefore
              ? `Notify #${getChannelName(
                  publicHoliday?.channel
                )}  of upcoming public holidays for the next ${
                  publicHoliday?.startBefore
                } weeks, every ${publicHoliday?.dayOfNotification} at ${
                  publicHoliday?.time
                }`
              : "Configure upcoming public holidays notifications!"
          }
          isEnabled={true}
          showCustomizeButton={true}
          publicHoliday={true}
        />
        <NotificationOption
          label="Motivational messages"
          description={`Motivation is must!💪🏼 Keep your employees motivated with beautiful one-liners periodically.`}
          isEnabled={true}
          showCustomizeButton={true}
          motivationalMessage={true}
        />
      </div>
    </div>
  );
};

export default SlackSettings;
