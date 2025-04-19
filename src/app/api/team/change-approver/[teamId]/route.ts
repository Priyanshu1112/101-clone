import { prisma } from "@/service/prisma";
import { Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest, { params }) {
  try {
    const { teamId } = await params; // Destructure directly
    const { approverId } = await request.json(); // Parse JSON payload

    if (!teamId || !approverId) {
      return NextResponse.json(
        { message: "Both teamId and approverId are required!" },
        { status: 400 }
      );
    }

    // Use Prisma transaction to batch queries for efficiency
    await prisma.$transaction([
      // Set approver's role to Lead
      prisma.teamUser.updateMany({
        where: { teamId, userId: approverId },
        data: { role: Role.Lead },
      }),

      // Set all other team members' roles to Member
      prisma.teamUser.updateMany({
        where: { teamId, userId: { not: approverId } },
        data: { role: Role.Member },
      }),

      // Reset approverId for all users in the team
      prisma.user.updateMany({
        where: { teamUsers: { some: { teamId } } },
        data: { approverId: null },
      }),
    ]);

    return NextResponse.json(
      { message: "Team roles and approver reset successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating team roles:", error);

    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
