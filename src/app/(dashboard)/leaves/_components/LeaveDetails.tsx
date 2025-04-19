"use client";

import React, { Fragment } from "react";
import { Info, LucideIcon } from "lucide-react";
import Typography from "../../_components/Typography";
import Flag from "@/assets/Flag";
import CalendarTick from "@/assets/CalendarTick";
import useUserStore from "@/store/user";
import { renderStringWithEmoji } from "../../settings/leave-policy/_components/LeavePolicyTable";
import useCalendarStore from "@/store/calendar";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

interface Block {
  icon: React.ComponentType<{ size: number }>; // Allow component or JSX element
  title?: string;
  text: string;
  endIcon?: LucideIcon; // Optional end icon
}

const LeaveDetails = () => {
  const { leaveDetail, user } = useUserStore();
  const { leaveDetails } = useCalendarStore();

  return (
    <div className="flex-1">
      <div className="flex flex-col gap-4">
        <Typography
          variant="paragraph1"
          text="Your leaves summary"
          className="font-semibold text-grey/400"
        />
        <div className="flex flex-col gap-3">
          {leaveDetail
            ?.filter((detail) =>
              user?.gender == "Male" ? !detail.name.includes("Menstrual") : true
            )
            ?.map((detail) => {
              if (detail.type == "Non_Deductible")
                return <Fragment key={detail.id}></Fragment>;

              const currentDetail = detail.detail.find(
                (detail) => detail.year == new Date().getFullYear().toString()
              );

              return (
                <div
                  key={detail.id}
                  className="flex justify-between  items-center"
                >
                  <Typography variant="paragraph2" className="font-semibold">
                    {renderStringWithEmoji(detail.name)}
                  </Typography>
                  <Typography
                    variant="label"
                    className="font-bold text-grey/400"
                  >
                    {isNaN(Number(currentDetail?.taken))
                      ? detail.unlimited
                        ? "Unlimited"
                        : `${detail.allowance} leaves left`
                      : `${currentDetail?.balance ?? 0} leaves left`}
                  </Typography>
                </div>
              );
            })}
        </div>

        {/* Divider */}
        <hr className="border-grey/200" />

        {/* Block with last leave details */}
        <div className="flex flex-col gap-3">
          {leaveDetails?.latestLeave && (
            <Block
              icon={CalendarTick}
              title="Your last leave was on"
              text={`${dayjs(leaveDetails?.latestLeave?.start).format(
                "MMM D, YYYY"
              )} (${dayjs(leaveDetails?.latestLeave?.start).fromNow()})`}
            />
          )}
          <Block
            icon={CalendarTick}
            text={`You can apply comp off for up ${
              user?.compOff ?? 0
            } to  days.`}
            endIcon={Info}
          />
          {leaveDetails?.upcomingHoliday && (
            <Block
              icon={Flag}
              title="Upcoming next holiday is"
              text={`${leaveDetails?.upcomingHoliday?.occasion} on ${
                leaveDetails?.upcomingHoliday.date
              } (${dayjs(leaveDetails?.upcomingHoliday.start)
                .fromNow()
                .replace(/^in/, "In")})`}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const Block = ({ icon: Icon, title, text, endIcon: EndIcon }: Block) => {
  return (
    <div className="p-2 bg-secondary-100/50 text-secondary-200 rounded-[8px] flex gap-3">
      <span className="my-1">
        <Icon size={20} />
      </span>

      <div className="flex-1">
        {title && (
          <Typography
            variant="label"
            text={title}
            className="text-grey/400 font-semibold"
          />
        )}
        <Typography variant="paragraph3" text={text} className="text-dark" />
      </div>

      {EndIcon && <EndIcon size={20} className="ml-3 my-1" />}
    </div>
  );
};

export default LeaveDetails;
