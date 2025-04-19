import { getPublicHolidays } from "@/app/api/_utils/getGoogleEvents";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }) {
  try {
    const { calendarId } = await params;

    // console.log({ calendarId: decodeURIComponent(calendarId) });

    if (!calendarId) return NextResponse.json({ status: 500 });
    const res = await getPublicHolidays(calendarId);

    return NextResponse.json(res);
  } catch (error) {
    console.error(error);
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 500 });

    return NextResponse.json(
      { message: "Uncaught error occured!" },
      { status: 500 }
    );
  }
}
