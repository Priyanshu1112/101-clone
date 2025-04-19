import { prisma } from "@/service/prisma";
import { AllowanceType, LeaveDetail, LeaveType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const companyId = request.nextUrl.searchParams.get("companyId");
  const leaveId = request.nextUrl.searchParams.get("leaveId");

  let leaveDetail:
    | {
        name: string;
        id: string;
        description: string;
        needsApproval: boolean;
        type: LeaveType;
        allowanceType: AllowanceType | null;
        allowance: number | null;
      }[]
    | LeaveDetail
    | null = [];

  if (companyId) {
    leaveDetail = await prisma.leaveDetail.findMany({
      where: { companyId: companyId ?? "" },
      orderBy: {
        createdAt: "desc",
      },
    });
  } else if (leaveId)
    leaveDetail = await prisma.leaveDetail.findUnique({
      where: { id: leaveId },
    });

  return NextResponse.json(leaveDetail);
}

export async function POST(request: NextRequest) {
  const {
    companyId,
    name,
    description,
    needsApproval,
    notifyAdmin,
    carryForward,
    unlimmited,
    addedOn,
    type,
    allowanceType,
    allowance,
  } = await request.json();

  const leaveDetail = await prisma.leaveDetail.create({
    data: {
      name,
      description,
      needsApproval: needsApproval ?? false,
      notifyAdmin: notifyAdmin ?? false,
      carryForward: carryForward ?? false,
      unlimited: unlimmited ?? false,
      addedOn,
      type,
      allowanceType,
      allowance: Number(allowance),
      companyId,
    },
  });

  return NextResponse.json({ success: true, leaveDetail });
}

export async function PUT(request: NextRequest) {
  const {
    leaveId,
    name,
    description,
    needsApproval,
    notifyAdmin,
    carryForward,
    unlimited,
    addedOn,
    type,
    allowanceType,
    allowance,
  } = await request.json();

  if (!leaveId)
    return NextResponse.json({
      success: false,
      message: "Leave Id is required!",
    });

  // Dynamically build the updateBody
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateBody: Record<string, any> = {};

  if (name) updateBody.name = name;
  if (description) updateBody.description = description;
  if (typeof needsApproval !== "undefined")
    updateBody.needsApproval = needsApproval;
  if (typeof notifyAdmin !== "undefined") updateBody.notifyAdmin = notifyAdmin;
  if (typeof carryForward !== "undefined")
    updateBody.carryForward = carryForward;
  if (typeof unlimited !== "undefined") updateBody.unlimited = unlimited;
  if (addedOn) updateBody.addedOn = addedOn;
  if (type) updateBody.type = type;
  if (allowanceType) updateBody.allowanceType = allowanceType;
  if (allowance) updateBody.allowance = Number(allowance);

  try {
    // Update the leaveDetail in the database
    const leaveDetail = await prisma.leaveDetail.update({
      where: { id: leaveId },
      data: updateBody,
    });

    return NextResponse.json({ success: true, leaveDetail });
  } catch (error) {
    console.error("Error updating leaveDetail:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to update leaveDetail.",
    });
  }
}

export async function DELETE(request: NextRequest) {
  const { leaveId } = await request.json();

  if (!leaveId)
    return NextResponse.json(
      { message: "Leave Id is required!" },
      { status: 500 }
    );

  await prisma.leaveDetail.delete({ where: { id: leaveId } });

  return NextResponse.json({});
}
