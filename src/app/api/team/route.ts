import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@services/prisma";
import { LeaveStatus, Role, UpdateResponseStatus } from "@prisma/client";
import dayjs from "dayjs";

export async function POST(request: NextRequest) {
  try {
    const { formData, lead, companyId } = await request.json();

    const { name, logo, approver, calendar, workday, members } = formData;

    // Check if the team name is already in use
    const teamPresent = await prisma.team.findUnique({
      where: { name, companyId },
    });

    if (teamPresent) {
      return NextResponse.json({
        message: "Team name already in use!",
        status: 500,
      });
    }

    let filteredMembers: string[];
    if (members.length > 0) {
      filteredMembers =
        members?.filter((memberId: string) => memberId !== approver) || [];
    } else {
      const fetchedMembers = await prisma.user.findMany({
        where: { companyId },
        select: { id: true },
      });

      filteredMembers = fetchedMembers
        .filter((member) => member.id != approver)
        .map((member) => member.id); // Extracting IDs
    }

    // Create the team
    const newTeam = await prisma.team.create({
      data: {
        name,
        logo,
        companyId,
        teamUsers: {
          create: [
            // Assign Lead role to approver or lead
            {
              user: {
                connect: {
                  id: approver || lead,
                },
              },
              role: Role.Lead,
            },
            // Add members with Member role
            ...filteredMembers.map((memberId: string) => ({
              user: {
                connect: {
                  id: memberId,
                },
              },
              role: Role.Member,
            })),
          ],
        },
        // Connect Calendar
        calendar: calendar
          ? {
              connect: {
                id: calendar,
              },
            }
          : undefined,
        // Connect Workday
        workDay: workday
          ? {
              connect: {
                id: workday,
              },
            }
          : undefined,
      },
    });

    return NextResponse.json({
      message: "Team created successfully!",
      status: 200,
      team: newTeam,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({
      message: "Internal server error!",
      status: 500,
    });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { formData, teamId } = await request.json();
    const { name, logo, approver, calendar, workday, members } = formData;

    // 1. Check if the team exists
    const existingTeam = await prisma.team.findUnique({
      where: { id: teamId },
      include: {
        teamUsers: true,
      },
    });

    if (!existingTeam) {
      return NextResponse.json({
        message: "Team not found!",
        status: 404,
      });
    }

    // 2. Check for duplicate team name
    if (name && name !== existingTeam.name) {
      const duplicateTeam = await prisma.team.findFirst({
        where: { name, companyId: existingTeam.companyId },
      });

      if (duplicateTeam) {
        return NextResponse.json({
          message: "Team name already in use!",
          status: 400,
        });
      }
    }

    // 3. Process team members
    const existingUserIds = existingTeam.teamUsers.map((tu) => tu.userId);
    const newMemberIds = members || [];

    const usersToAdd = newMemberIds.filter(
      (id) => !existingUserIds.includes(id)
    );
    const usersToRemove = existingUserIds.filter(
      (id) => !newMemberIds.includes(id)
    );

    // 4. Prepare update data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateBody: any = {};
    if (name) updateBody.name = name;
    if (logo) updateBody.logo = logo;
    if (calendar) updateBody.calendar = { connect: { id: calendar } };
    if (workday) updateBody.workDay = { connect: { id: workday } };

    updateBody.teamUsers = {
      // Remove users not in the updated list
      deleteMany: usersToRemove.map((userId) => ({
        userId,
      })),

      // Update or add users
      upsert: [
        // Ensure the approver has the `Lead` role
        {
          where: { teamId_userId: { teamId, userId: approver } },
          update: { role: "Lead" },
          create: {
            user: { connect: { id: approver } },
            role: "Lead",
          },
        },
        // Add new members
        ...usersToAdd.map((userId) => ({
          where: { teamId_userId: { teamId, userId } },
          update: { role: "Member" },
          create: {
            user: { connect: { id: userId } },
            role: "Member",
          },
        })),
      ],

      // Ensure all existing Leads (except approver) are set to Members
      updateMany: {
        where: {
          teamId,
          userId: { not: approver }, // Exclude the approver
          role: "Lead", // Only update Leads
        },
        data: { role: "Member" },
      },
    };

    // 5. Update the team
    const updatedTeam = await prisma.team.update({
      where: { id: teamId },
      data: updateBody,
      include: {
        calendar: { select: { id: true, country: true } },
        workDay: { select: { id: true, name: true } },
      },
    });

    const teamUsers = await prisma.teamUser.findMany({
      where: { teamId: updatedTeam.id },
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

    const teamMembers = teamUsers.map((teamUser) => ({
      ...teamUser.user,
      role: teamUser.role,
      isArchive: teamUser.isArchive,
    }));

    return NextResponse.json({
      message: "Team updated successfully!",
      status: 200,
      team: { ...updatedTeam, members: teamMembers },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      message:
        error instanceof Error ? error.message : "Internal server error!",
      status: 500,
    });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { teamId } = await request.json();

    if (!teamId)
      return NextResponse.json(
        { message: "Team is required!" },
        { status: 404 }
      );

    // Check if the team exists
    const team = await prisma.team.findUnique({
      where: { id: teamId },
    });

    if (!team) {
      console.log("Team not found!");
      return;
    }

    // Step 1: Delete related TeamUsers
    await prisma.teamUser.deleteMany({
      where: { teamId },
    });

    // Step 5: Delete the Team
    await prisma.team.delete({
      where: { id: teamId },
    });

    return NextResponse.json({});
  } catch (error) {
    console.error("Error deleting team:", error);
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Unexpected error occured!",
      },
      { status: 500 }
    );
  }
}
