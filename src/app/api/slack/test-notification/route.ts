import { NextResponse } from "next/server";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export async function GET() {
  try {
    const res = dayjs().add(2, "weeks").format("YYYY-MM-DD");
    return NextResponse.json(res);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
