import { NextRequest, NextResponse } from "next/server";
import { getLeaveDetaillWithBalance } from "../../_utils/getLeaveDetailWithBalance";

export interface GroupedLeaveRecords {
  leaveDetailId: string;
  details: { year: string; taken: string; balance: string }[]; // year, taken, and balance in each year detail
}

export async function GET(request: NextRequest) {
  try {
    const companyId = request.nextUrl.searchParams.get("companyId");
    const userId = request.nextUrl.searchParams.get("userId");

    if (!companyId || !userId)
      return NextResponse.json(
        { message: "All fields are required!" },  
        { status: 400 }
      );

    const leaveDetailWithBalance = await getLeaveDetaillWithBalance({
      userId,
      companyId,
    });

    return NextResponse.json(leaveDetailWithBalance);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Unexpected error occured",
      },
      { status: 500 }
    );
  }
}
