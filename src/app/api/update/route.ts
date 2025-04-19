import { prisma } from "@/service/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const {
      time,
      questions,
      team: teamId,
      channel: channelId,
      company: companyId,
      members,
    } = await request.json();

    if (!time || !questions || !teamId) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // Fetch all users in the team
    let memberConnections: { id: string }[] = [];
    if (members.length == 0) {
      const teamUsers = await prisma.teamUser.findMany({
        where: { teamId },
        select: { userId: true },
      });
      // Map userIds for connection

      memberConnections = teamUsers.map((teamUser) => ({
        id: teamUser.userId,
      }));
    } else {
      memberConnections = members.map((member) => ({ id: member }));
    }

    // Create Update and connect users
    const update = await prisma.update.create({
      data: {
        time,
        questions,
        channelId,
        members: {
          connect: memberConnections,
        },
        // Correctly link the Team relation
        team: {
          connect: {
            id: teamId, // Use the `id` field to link the Team
          },
        },
        company: {
          connect: {
            id: companyId, // Assuming the `companyId` is used to connect the Company
          },
        },
      },
      include: { members: { select: { id: true } } },
    });

    return NextResponse.json(update);
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { message: "Unexpected error occurred" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const {
      id,
      time,
      questions,
      team: teamId,
      channel: channelId,
      company: companyId,
      members,
    } = await request.json();

    if (!id || !time || !questions || !teamId) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    let memberConnections: { id: string }[] = [];
    let memberDisconnections: { id: string }[] = [];

    // If members array is not empty, connect the specified members
    if (members.length > 0) {
      memberConnections = members.map((member) => ({ id: member }));

      // Fetch the current members to disconnect those that are not in the updated list
      const existingMembers = await prisma.update.findUnique({
        where: { id },
        select: { members: { select: { id: true } } },
      });

      const existingMemberIds = existingMembers?.members.map((m) => m.id) || [];
      memberDisconnections = existingMemberIds
        .filter((memberId) => !members.includes(memberId))
        .map((id) => ({ id }));
    } else {
      // If no members provided (members.length === 0), fetch all team users
      const teamUsers = await prisma.teamUser.findMany({
        where: { teamId },
        select: { userId: true },
      });
      memberConnections = teamUsers.map((teamUser) => ({
        id: teamUser.userId,
      }));
    }

    console.log({ memberConnections, memberDisconnections });

    // Update the Update entry with connections and disconnections
    const update = await prisma.update.update({
      where: { id },
      data: {
        time,
        questions,
        channelId,
        team: {
          connect: { id: teamId },
        },
        company: {
          connect: { id: companyId },
        },
        members: {
          disconnect: memberDisconnections,
          connect: memberConnections,
        },
      },
      include: { members: { select: { id: true } } },
    });

    return NextResponse.json(update);
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { message: "Unexpected error occurred" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ message: "ID is required" }, { status: 400 });
    }

    // Fetch the Update to get associated data (e.g., UpdateResponses and members)
    const update = await prisma.update.findUnique({
      where: { id },
      include: {
        updateResponse: true, // Including related UpdateResponse records
        members: true, // Including related members (Users)
      },
    });

    if (!update) {
      return NextResponse.json(
        { message: "Update not found" },
        { status: 404 }
      );
    }

    // Optionally, delete all related UpdateResponses (if required)
    await prisma.updateResponse.deleteMany({
      where: {
        updateId: id,
      },
    });

    // Delete the Update record itself
    await prisma.update.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Update deleted successfully" });
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { message: "Unexpected error occurred" },
      { status: 500 }
    );
  }
}
