import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@services/prisma";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { message: "ID query parameter is required" },
      { status: 400 }
    );
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
      include: {
        approver: { select: { id: true, name: true } },
        teamUsers: {
          select: {
            teamId: true,
            role: true,
            user: { select: { id: true, name: true } },
            team: {
              select: {
                id: true,
                name: true,
                workDay: { select: { workWeek: true } },
              },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// export async function PUT(request: NextRequest) {
//   const { teamName, teamMember } = await request.json();

//   if (!teamMember || !teamName)
//     return NextResponse.json(
//       { message: "All fields are required!" },
//       { status: 500 }
//     );

//   return NextResponse.json({});
// }
