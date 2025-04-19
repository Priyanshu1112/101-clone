import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export const getValidResponse = (responses, time: number, current = false) => {
  const currentTime = dayjs().tz("Asia/Kolkata");

  return responses.filter((response) => {
    if (!response.update?.time) return false;

    const [hours, minutes, seconds] = response.update.time
      .split(":")
      .map(Number);

    const updateTime = dayjs()
      .tz("Asia/Kolkata")
      .hour(hours)
      .minute(minutes)
      .second(seconds)
      .add(time, "minute");

    if (current) return currentTime.isSame(updateTime, "minute");

    return (
      currentTime.isAfter(updateTime, "minute") ||
      currentTime.isSame(updateTime, "minute")
    );
  });
};
