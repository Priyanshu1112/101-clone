import { calendar } from "@/service/google";
import { EventType } from "@types";

export const getPublicHolidays = async (calendarId: string) => {
  let events: {
    id: string;
    date: string;
    occasion: string;
    reason: string;
    start: string;
    end: string;
    type: EventType;
  }[] = [];

  try {
    if (!calendar) return;

    // Get the current year
    const currentYear = new Date().getFullYear();

    const response = await calendar.events.list({
      calendarId,
      singleEvents: true,
      orderBy: "startTime",
      timeMin: new Date(`${currentYear}-01-01T00:00:00Z`).toISOString(), // Start of the year
      timeMax: new Date(`${currentYear}-12-31T23:59:59Z`).toISOString(), // End of the year
    });

    if (response.data.items && response.data.items.length > 0) {
      events = response.data.items
        .filter(
          (event) =>
            event.id &&
            event.summary &&
            event.start &&
            event.end &&
            event.description == "Public holiday"
        )
        .map((event) => {
          const startDate = new Date(
            event.start?.date || (event.start?.dateTime as string)
          );
          const endDate = new Date(
            event.end?.date || (event.end?.dateTime as string)
          );

          // Calculate the difference in days
          const diffInDays = Math.ceil(
            (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
          );

          // Determine the date field
          const date =
            diffInDays === 1
              ? startDate.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              : `${startDate.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })} - ${endDate.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}`;

          return {
            id: event.id as string,
            // serial : ++index,
            date,
            occasion: event.summary as string,
            reason: event.description || "",
            start: event.start?.date || (event.start?.dateTime as string),
            end: event.end?.date || (event.end?.dateTime as string),
            type: "HOLIDAY" as unknown as EventType.HOLIDAY,
          };
        })
        .filter((event) => {
          // Filter to include only events from the current year
          const eventStartYear = new Date(event.start).getFullYear();
          return eventStartYear === currentYear;
        });
    }
  } catch (error) {
    return {
      error,
    };
  }

  return { events };
};
