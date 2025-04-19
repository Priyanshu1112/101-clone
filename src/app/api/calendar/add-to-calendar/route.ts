import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/_authOptions";
import { calendarService } from "@/service/google";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const accessToken = session?.accessToken;

    if (!accessToken) {
      return NextResponse.json(
        { message: "No access token found." },
        { status: 400 }
      );
    }

    const event = {
      summary: "Paid Leave",
      description: "This is a paid leave day",
      start: {
        dateTime: "2024-12-25T09:00:00-07:00",
        timeZone: "America/Los_Angeles",
      },
      end: {
        dateTime: "2024-12-25T17:00:00-07:00",
        timeZone: "America/Los_Angeles",
      },
    };

    // Insert the event into the calendar
    const response = await calendarService?.events.insert({
      calendarId: "primary",
      requestBody: event,
    });

    console.log(response);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Unexpected error!" },
      { status: 500 }
    );
  }
}
