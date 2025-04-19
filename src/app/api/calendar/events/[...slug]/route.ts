import { NextRequest, NextResponse } from "next/server";
import { getPublicHolidays } from "../../../_utils/getGoogleEvents";
import { prisma } from "@/service/prisma";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import utc from "dayjs/plugin/utc";

dayjs.extend(customParseFormat);
dayjs.extend(utc);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const year = parseInt(
      request.nextUrl.searchParams.get("year") || `${new Date().getFullYear()}`
    );

    const [companyId] = (await params).slug;
    // console.log(await params)

    if (isNaN(year) || year < 1900 || year > 2100 || !companyId) {
      return NextResponse.json({ error: "Invalid fields!" }, { status: 400 });
    }

    // Fetch holidays for the given company
    const calendar = await prisma.calendar.findMany({
      where: { companyId },
      include: {
        holiday: true,
      },
    });

    // Fetch users including birthday and workAnniversary
    const users = await prisma.user.findMany({
      where: { companyId: companyId },
      select: {
        id: true,
        birthday: true,
        workAnniversary: true,
        name: true,
        colorCode: true,
      },
    });

    // Map holidays as before
    const holidaysMapped = calendar.flatMap((cal) =>
      cal.holiday.map((holiday) => ({
        ...holiday, // Include all fields from holiday
        date: holiday.date || new Date().toISOString(), // Ensure date is included explicitly for sorting
        occasion: holiday.occasion,
        type: "HOLIDAY", // Mark type as "HOLIDAY"
        end: dayjs(holiday.end, "YYYY-MM-DD")
          .subtract(1, "day")
          .format("YYYY-MM-DD"),
      }))
    );
    // Assuming the `year` variable is already defined as shown earlier:
    // const year = parseInt(request.nextUrl.searchParams.get("year") || `${new Date().getFullYear()}`);

    const birthdayEvents = users
      .filter((user) => user.birthday)
      .map((user) => {
        // Parse the birthday with the given format, then update the year to the current year
        const birthdayDate = dayjs(user.birthday, "DD/MM/YYYY").year(year);
        return {
          date: birthdayDate.format("YYYY-MM-DD"),
          start: birthdayDate.format("YYYY-MM-DD"),
          end: birthdayDate.format("YYYY-MM-DD"),
          id: user.id + user.birthday, // Unique id combining user id and birthday string
          occasion: "Birthday",
          type: "BIRTHDAY",
          name: user?.name,
          colorCode: user?.colorCode,
        };
      });

    const workAnniversaryEvents = users
      .filter((user) => user.workAnniversary)
      .map((user) => {
        // Parse the original work anniversary date using the expected format
        const originalAnniversary = dayjs(user.workAnniversary, "DD/MM/YYYY");
        // Adjust the anniversary to the current (or specified) year
        const anniversaryDate = originalAnniversary.year(year);
        // Calculate experience as the difference between the specified year and the original anniversary year
        const exp = year - originalAnniversary.year();
        return {
          date: anniversaryDate.format("YYYY-MM-DD"),
          start: anniversaryDate.format("YYYY-MM-DD"),
          end: anniversaryDate.format("YYYY-MM-DD"),
          id: user.id + user.workAnniversary, // Unique id combining user id and anniversary string
          occasion: "Work Anniversary",
          type: "WORK_ANNIVERSARY",
          name: user?.name,
          colorCode: user?.colorCode,
          exp, // Experience (in years) computed from the work anniversary date
        };
      });

    // Fetch teams for the given company's users
    const teams = await prisma.team.findMany({
      where: {
        teamUsers: {
          some: {
            userId: { in: users.map((user) => user.id) },
          },
        },
      },
      select: {
        teamUsers: { select: { userId: true } }, // Include details of team members
      },
    });

    // Collect all userIds for leaveRecord queries
    const userIds = teams.flatMap((team) =>
      team.teamUsers.map((user) => user.userId)
    );

    // Fetch leave records for all users at once
    const leaveRecords = await prisma.leaveRecord.findMany({
      where: {
        userId: {
          in: userIds, // Use `in` to fetch leave records for all users in one query
        },
      },
      include: {
        leaveDetail: {
          select: { name: true },
        },
        approvedBy: { select: { name: true } },
        user: {
          select: {
            id: true,
            name: true,
            colorCode: true,
          },
        },
      },
    });

    const leaveDetails = leaveRecords.map((leave) => ({
      date: leave.start, // Normalize date format
      start: leave.start,
      end: leave.end,
      userId: leave.userId,
      startTime: leave.startTime,
      endTime: leave.endTime,
      occasion: "Leave",
      type: "LEAVE",
      id: leave.id,
      leaveName: leave.leaveDetail.name,
      approver: leave.approvedBy?.name,
      name: leave.user?.name,
      colorCode: leave.user?.colorCode,
      status: leave.status,
      reason: leave.reason,
    }));

    // Combine all event types together
    const combinedRecords = [
      ...holidaysMapped,
      ...leaveDetails,
      ...birthdayEvents,
      ...workAnniversaryEvents,
    ];

    // Sort the records by their date field
    const sortedData = combinedRecords.sort((a, b) => {
      const dateA = a.date ? new Date(a.date) : new Date(0); // Use 0 if the date is invalid
      const dateB = b.date ? new Date(b.date) : new Date(0); // Use 0 if the date is invalid

      // Ensure the dates are valid before performing the sort
      if (isNaN(dateA.getTime())) return 1; // If dateA is invalid, put it after b
      if (isNaN(dateB.getTime())) return -1; // If dateB is invalid, put it after a

      return dateA.getTime() - dateB.getTime();
    });

    return NextResponse.json(sortedData);
  } catch (error) {
    console.error("Error fetching records:", error);
    return NextResponse.json(
      { error: "Something went wrong!" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { calendarId } = await request.json();

    if (!calendarId) return NextResponse.json({ status: 500 });
    const res = await getPublicHolidays(calendarId);

    return NextResponse.json(res);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ status: 500 });
  }
}
