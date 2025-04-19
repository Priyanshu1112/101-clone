import { NextRequest, NextResponse } from "next/server";
import { userSession } from "../../_utils/getSession";
import { prisma } from "@/service/prisma";
import { Company } from "@prisma/client";

export async function PUT(request: NextRequest) {
  const { teamName, teamMember } = await request.json();

  if (!teamMember || !teamName)
    return NextResponse.json(
      { message: "All fields are required!" },
      { status: 500 }
    );

  const session = await userSession();
  let company: Company | null = null;

  const dbUser = await prisma.user.update({
    where: { id: session?.user.id },
    data: { needsOnboarding: false },
  });

  if (dbUser)
    company = await prisma.company.update({
      where: { id: dbUser.companyId! },
      data: {
        name: teamName,
        strength: Number(teamMember),
      },
    });

  return NextResponse.json(company);
}
