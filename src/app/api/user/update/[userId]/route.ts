import { prisma } from "@/service/prisma";
import { Gender } from "@prisma/client";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    if (!userId) {
      return NextResponse.json(
        { message: "User Id is required!" },
        { status: 400 }
      );
    }

    const {
      firstName,
      lastName,
      workAnniversary,
      birthdate,
      email,
      approverId,
      gender,
    } = await request.json();

    const updatedData: Record<string, string> = {};

    if (firstName || lastName) {
      updatedData.name = `${firstName ?? ""} ${lastName ?? ""}`.trim();
    }
    if (workAnniversary) {
      updatedData.workAnniversary = workAnniversary;
    }
    if (birthdate) {
      updatedData.birthday = birthdate;
    }
    if (email) {
      updatedData.email = email;
    }

    if (approverId) updatedData.approverId = approverId;

    if (gender)
      updatedData.gender =
        Gender.Male.toLowerCase() == gender ? Gender.Male : Gender.Female;

    // Ensure there's something to update
    if (Object.keys(updatedData).length === 0) {
      return NextResponse.json(
        { message: "No valid fields to update." },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updatedData,
    });

    if (updatedUser.role !== "Administrator") {
      await prisma.user.update({
        where: { id: updatedUser.id },
        data: { needsOnboarding: false },
      });
    }

    return NextResponse.json({
      message: "User updated successfully!",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { message: "An unknown error occurred." },
      { status: 500 }
    );
  }
}
