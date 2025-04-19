import { getLeaveDetaillWithBalance } from "@/app/api/_utils/getLeaveDetailWithBalance";
import { NextRequest, NextResponse } from "next/server";

export interface GroupedLeaveRecords {
  leaveDetailId: string;
  details: { year: string; taken: string; balance: string }[]; // year, taken, and balance in each year detail
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string; companyId: string }> }
) {
  try {
    const { userId, companyId } = await params;

    console.log("==FETCING DETAILS===");
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
