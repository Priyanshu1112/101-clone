import { prisma } from "@/service/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  try {
    const {
      companyId,
      slackNotification,
      birthdayNotification: slackBirthday,
      workanniversaryNotification: slackWorkanniversary,
      publicHolday: slackUpcomingHoliday,
      motivationNotification: slackMotivationalMessage,
    } = await request.json();

    if (!companyId)
      return NextResponse.json(
        { message: "Company id is required!" },
        { status: 404 }
      );

    let updateBody = {};

    if (slackNotification != undefined)
      updateBody = { ...updateBody, slackNotification };

    if (slackBirthday) updateBody = { ...updateBody, slackBirthday };

    if (slackWorkanniversary)
      updateBody = { ...updateBody, slackWorkanniversary };

    if (slackUpcomingHoliday)
      updateBody = { ...updateBody, slackUpcomingHoliday };

    if (slackMotivationalMessage)
      updateBody = { ...updateBody, slackMotivationalMessage };

    const company = await prisma.company.update({
      where: { id: companyId },
      data: { ...updateBody },
    });

    return NextResponse.json(company);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Unexprected server error",
      },
      { status: 500 }
    );
  }
}
