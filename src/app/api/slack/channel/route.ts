import { NextResponse } from "next/server";
import { getAllChannels } from "../../_utils/getChannels";

export async function GET() {
  try {
    return NextResponse.json(await getAllChannels());
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: "Internal server error!" },
      { status: 500 }
    );
  }
}
