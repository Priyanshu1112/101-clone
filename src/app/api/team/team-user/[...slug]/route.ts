import { prisma } from "@/service/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }) {
  try {
    const { slug } = await params;

    const teamUsers = await Promise.all(
      slug.map((teamId: string) =>
        prisma.teamUser.findMany({
          where: { teamId: teamId },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                colorCode: true,
                email: true,
                approver: { select: { id: true, name: true } },
              },
            },
          },
        })
      )
    );

    return NextResponse.json(teamUsers.flat());
  } catch (error) {
    console.error(error);

    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 500 });

    return NextResponse.json(
      { message: "Unexpected error occured!" },
      { status: 500 }
    );
  }
}
