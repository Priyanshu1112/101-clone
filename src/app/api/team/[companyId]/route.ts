import { prisma } from "@/service/prisma";
import { LeaveStatus, UpdateResponseStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import dayjs from "dayjs";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request, { params }) {
  try {
    const { companyId } = await params;

    if (!companyId) {
      return NextResponse.json(
        { message: "Company id is required!" },
        { status: 400 }
      );
    }

    // Start a Prisma transaction for efficiency
    const teams = await prisma.team.findMany({
      where: { companyId },
      include: {
        calendar: { select: { id: true, country: true } },
        workDay: { select: { id: true, name: true } },
      },
    });

    const teamUserPromises = teams.map(async (team) => {
      const teamUsers = await prisma.teamUser.findMany({
        where: { teamId: team.id },
        select: {
          role: true,
          isArchive: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              colorCode: true,
              approver: { select: { id: true, name: true } },
              leaveRecord: {
                where: {
                  status: LeaveStatus.APPROVED,
                  start: { lt: dayjs().startOf("day").toString() },
                },
                orderBy: { start: "desc" },
                take: 1,
                select: {
                  id: true,
                  start: true,
                  startTime: true,
                },
              },
              updateResponse: {
                where: { NOT: { status: UpdateResponseStatus.Scheduled } },
                select: { id: true, status: true },
              },
            },
          },
        },
      });

      // Map teamUsers to extract members
      const members = teamUsers.map((teamUser) => ({
        ...teamUser.user,
        role: teamUser.role,
        isArchive: teamUser.isArchive,
      }));

      return { ...team, members };
    });

    // Fetch all data concurrently outside of a transaction
    const teamsWithMembers = await Promise.all(teamUserPromises);

    return NextResponse.json(teamsWithMembers);
  } catch (error) {
    console.error(error);

    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { message: "Internal server error!" },
      { status: 500 }
    );
  }
}
