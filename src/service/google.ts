import { calendar_v3, google, people_v1 } from "googleapis";

export let calendarService: calendar_v3.Calendar | null = null;

export const calendar = google.calendar({
  version: "v3",
  auth: process.env.GOOGLE_API_KEY,
});

export let peopleService: people_v1.People | null = null;

export const setService = async (accessToken: string) => {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });

  peopleService = google.people({ version: "v1", auth });
  calendarService = google.calendar({ version: "v3", auth });
};
