import { prisma } from "@/service/prisma";
import { NextRequest, NextResponse } from "next/server";

const getTeams = (user) => {
  let teams = user.teamUsers?.map((data) => data.team.name) || [];
  teams = teams.length > 1 ? teams.join(", ") : teams[0] || null;

  return teams;
};

export async function GET(request: NextRequest) {
  try {
    const company = request.nextUrl.searchParams.get("company");
    const { cycle, team, members, type } = JSON.parse(
      request.nextUrl.searchParams.get("body") ?? ""
    );

    if (!cycle || !type || !company)
      return NextResponse.json(
        { message: "CompanyId, cycle and type is required!" },
        { status: 500 }
      );

    if (!["summary", "record"].includes(type))
      return NextResponse.json({ message: "Invaild type!" }, { status: 500 });

    const teamId = JSON.parse(team) ? JSON.parse(team).id : null;
    const memberId = JSON.parse(members) ? JSON.parse(members).id : null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let res: any | null = null;
    // Check for type, if summary
    if (type === "summary") {
      res = await prisma.user.findMany({
        where: memberId
          ? { id: { in: memberId } }
          : teamId
          ? { teamUsers: { some: { teamId: { in: teamId } } } }
          : { companyId: company },
        select: {
          id: true,
          name: true,
          approver: { select: { name: true } },
          teamUsers: { select: { team: { select: { name: true } } } },
          leaveRecord: {
            where: { status: "APPROVED", start: { startsWith: cycle } },
          },
        },
      });

      // Normalize res structure
      res = res?.map((user) => {
        const teams = getTeams(user); // Handle empty teams

        return {
          name: user.name,
          approver: user.approver?.name || null,
          teams,
          leaveRecord: user.leaveRecord || [],
        };
      });
    } else {
      res = await prisma.leaveRecord.findMany({
        where: {
          user: memberId
            ? { id: { in: memberId } }
            : teamId
            ? { teamUsers: { some: { teamId: { in: teamId } } } }
            : { companyId: company },
          start: { startsWith: cycle },
        },
        include: {
          user: {
            select: {
              name: true,
              teamUsers: { select: { team: { select: { name: true } } } },
            },
          },
          approvedBy: { select: { name: true } },
          leaveDetail: { select: { name: true } },
        },
      });

      res = res.map((record) => {
        return {
          date: record.start,
          name: record.user.name,
          teams: getTeams(record.user),
          leaveRecord: record,
          type: record.leaveDetail.name,
          approver: record.approvedBy?.name ?? "",
        };
      });
    }

    return NextResponse.json(res);
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
