import { prisma } from "@/service/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const companies = await prisma.company.findMany();

    

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
