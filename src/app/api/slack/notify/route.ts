import { PublicHoliday } from "@/app/(dashboard)/settings/integrations/_components/PublicHolidayForm";
import { prisma } from "@/service/prisma";
import slackClient from "@/service/slack";
import dayjs from "dayjs";
import { NextResponse } from "next/server";
import { LeaveSummary } from "@types";
import isoWeek from "dayjs/plugin/isoWeek";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { LeaveStatus, LeaveTime } from "@prisma/client";
import isBetween from "dayjs/plugin/isBetween";
import { ChatScheduleMessageResponse } from "@slack/web-api";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { Summary } from "@/app/(dashboard)/settings/integrations/_components/SlackSettings";
import {
  Frequency,
  MotivationalMessage,
} from "@/app/(dashboard)/settings/integrations/_components/MotivationForm";

dayjs.extend(isoWeek); // For ISO week support
dayjs.extend(utc); // For UTC support
dayjs.extend(timezone); // For timezone support
dayjs.extend(isBetween); // For isBetween functionality
dayjs.extend(customParseFormat);

export async function GET() {
  try {
    const companies = await prisma.company.findMany();

    const slackMessages: Promise<ChatScheduleMessageResponse>[] = [];

    const today = dayjs().tz("Asia/Kolkata");
    const isWeekEnd = today.day() === 0 || today.day() === 6;
    for (const company of companies) {
      const timezone = "Asia/Kolkata";
      const currentDate = dayjs().tz(timezone).format("YYYY-MM-DD");
      const currentDate2 = dayjs().tz(timezone).format("DD-MM");
      const currentTime = dayjs().tz(timezone).format("h:mm A");
      const url =
        "https://cgtqfrbaktzfovjvgyun.supabase.co/storage/v1/object/public/GIFS/";

      const allUsers = await prisma.user.findMany({
        where: {
          companyId: company.id,
        },
        select: {
          name: true,
          email: true,
          slackId: true,
          teamUsers: { select: { team: { select: { name: true } } } },
          birthday: true,
          workAnniversary: true,
          leaveRecord: {
            where: {
              status: { not: LeaveStatus.REJECTED },
              OR: [
                {
                  start: { lte: currentDate },
                  end: { gte: currentDate },
                },
                {
                  start: currentDate,
                  end: null,
                },
              ],
            },
            include: {
              leaveDetail: { select: { name: true } },
            },
          },
        },
      });

      if (company.slackNotification) {
        const today = dayjs().tz("Asia/Kolkata");
        const birthday = company.slackBirthday as unknown as Summary;
        const workanniversary =
          company.slackWorkanniversary as unknown as Summary;
        const publicHoldiay =
          company.slackUpcomingHoliday as unknown as PublicHoliday;

        if (birthday?.on && currentTime == birthday?.time) {
          const users = allUsers
            .filter((user) => {
              return (
                dayjs(user.birthday, "DD-MM-YYYY").format("DD-MM") ==
                currentDate2
              );
            })
            .map((user) => {
              const expLevelYears = today.diff(
                dayjs(user.workAnniversary, "DD/MM/YYYY"),
                "years"
              ); // Convert to years
              return { ...user, expLevel: expLevelYears };
            })
            .sort((a, b) => b.expLevel - a.expLevel);

          users.forEach((user) => {
            const text = getBirthdayAnniversaryText(
              user.slackId,
              user.expLevel,
              user.workAnniversary
            );

            slackMessages.push(
              slackClient.chat.postMessage({
                channel: birthday.channel,
                text,
                attachments: [
                  {
                    fallback: "Birthday GIF",
                    image_url: url + getGIF(user.name),
                  },
                ],
              })
            );
          });
        }

        if (workanniversary?.on && currentTime == workanniversary?.time) {
          const users = allUsers
            .filter(
              (user) =>
                dayjs(user.workAnniversary, "DD-MM-YYYY").format("DD-MM") ==
                currentDate2
            )
            .map((user) => {
              const expLevelYears = today.diff(
                dayjs(user.workAnniversary, "DD/MM/YYYY"),
                "years"
              ); // Convert to years
              return { ...user, expLevel: expLevelYears };
            })
            .sort((a, b) => b.expLevel - a.expLevel);

          users.forEach((user) => {
            const text = getBirthdayAnniversaryText(
              user.slackId,
              user.expLevel,
              user.workAnniversary,
              false
            );

            slackMessages.push(
              slackClient.chat.postMessage({
                channel: birthday.channel,
                text,
                attachments: [
                  {
                    fallback: "Birthday GIF",
                    image_url: url + getGIF(user.name, false),
                  },
                ],
              })
            );
          });
        }

        if (publicHoldiay?.on && currentTime == publicHoldiay?.time) {
          if (dayjs().format("dddd") !== publicHoldiay.dayOfNotification)
            continue;

          const calendars = await prisma.calendar.findMany({
            where: { companyId: company.id },
            select: {
              holiday: {
                where: {
                  start: {
                    gte: today.format("YYYY-MM-DD"),
                    lte: today
                      .add(Number(publicHoldiay.startBefore), "week")
                      .format("YYYY-MM-DD"),
                  },
                },
              },
            },
          });

          const holiday = calendars.flatMap((calendar) => calendar.holiday);

          if (holiday?.length !== 0) {
            let text = "";
            if (holiday.length == 1)
              text = `🎉Upcoming holiday ${holiday[0].occasion} on ${holiday[0].date}!`;
            else {
              const holidays = holiday.map(
                (data) => data.occasion + " on " + data.date
              );
              const lastHoliday = holidays.pop();
              text = `🎉 Upcoming holidays *${holidays.join(
                ", "
              )}* and *${lastHoliday}*!`;
            }

            slackMessages.push(
              slackClient.chat.postMessage({
                channel: publicHoldiay.channel,
                text,
              })
            );
          }
        }
      }

      const dailyLeaveSummary =
        company.dailyLeaveSummary as unknown as LeaveSummary;

      if (
        dailyLeaveSummary &&
        currentTime == dailyLeaveSummary.time &&
        !isWeekEnd
      ) {
        const names = allUsers
          .filter((user) => {
            return user.leaveRecord.some(
              (record) => {
                return dayjs().isBetween(
                  dayjs(record.start),
                  record.end ?? record.start,
                  "date",
                  "[]"
                );
              } // Check if any record matches the current date
            );
          })
          .map((user) => {
            const cd = dayjs(currentDate, "YYYY-MM-DD");
            const records = user.leaveRecord.map((record) => ({
              name: record.leaveDetail.name,
              type: cd.isBetween(
                dayjs(record.start, "YYYY-MM-DD"),
                dayjs(record.end, "YYYY-MM-DD"),
                "date",
                "()"
              )
                ? LeaveTime.FULL_DAY
                : cd.isSame(dayjs(record.end, "YYYY-MM-DD")) && record.endTime
                ? record.endTime
                : record.startTime,
              status: record.status,
            }));
            return {
              name: user.name,
              team: textFromArray(
                user.teamUsers
                  .map((team) => team.team.name)
                  .sort((a, b) => a.localeCompare(b))
              ),
              leaveName: textFromArray(
                records.map((record) => {
                  const name = record.name;

                  return (
                    String.fromCodePoint(parseInt(name.split(" ")[0], 16)) +
                    " " +
                    name.split(" ").slice(1).join(" ") +
                    (record.status == LeaveStatus.PENDING ? " (Pending)" : "")
                  );
                })
              ),
              type: textFromArray(
                records.map((record) => {
                  const type = record?.type?.split("_")[0];

                  return type[0] + type.slice(1).toLocaleLowerCase() + " day";
                })
              ),
            };
          })
          .sort((a, b) => a.name.localeCompare(b.name));

        if (names.length !== 0) {
          const text = getLeaveText(names);

          slackMessages.push(
            slackClient.chat.postMessage({
              channel: dailyLeaveSummary.channel,
              text,
            })
          );
        } else {
          const randomMessages = [
            "Full house today. No one is on leave. :raised_hands::skin-tone-3:",
            "Squad’s complete. No one is on leave today.",
            "Zero empty seats. No leaves today.",
            "Attendance: 100% | Leaves: 0%",
            "Not a single missing face. Everyone's available today.",
            "Team’s running at 100% strength today. No one is on leave.",
          ];

          const text =
            randomMessages[Math.floor(Math.random() * randomMessages.length)];
          slackMessages.push(
            slackClient.chat.postMessage({
              channel: dailyLeaveSummary.channel,
              text,
            })
          );
        }
      }

      const weeklyLeaveSummary =
        company.weeklyLeaveSummary as unknown as LeaveSummary;
      if (weeklyLeaveSummary && currentTime == weeklyLeaveSummary.time) {
        if (weeklyLeaveSummary.day == dayjs().format("dddd")) {
          const currentWeekStart = dayjs()
            .tz(timezone)
            .startOf("isoWeek")
            .format("YYYY-MM-DD"); // Start of the current week
          const currentWeekEnd = dayjs()
            .tz(timezone)
            .endOf("isoWeek")
            .format("YYYY-MM-DD"); // End of the current week

          const filteredUsers = allUsers
            .filter((user) => {
              return (
                user.leaveRecord.filter((record) => {
                  const recordStart = dayjs(record.start).tz(timezone);

                  const recordEnd = dayjs(record.end).tz(timezone);

                  return (
                    recordStart.isBetween(
                      currentWeekStart,
                      currentWeekEnd,
                      null,
                      "[]" // Use "()" to exclude boundaries if needed
                    ) ||
                    recordEnd.isBetween(
                      currentWeekStart,
                      currentWeekEnd,
                      null,
                      "[]" // Use "()" to exclude boundaries if needed
                    )
                  );
                }).length > 0
              ); // Ensure the user has at least one leave record in the current week
            })
            .map((user) => {
              const records = user.leaveRecord.map((record) => ({
                name: record.leaveDetail.name,
                st: record.startTime,
                et: record.endTime,
                start: record.start,
                end: record.end,
              }));

              return {
                name: user.name,
                team: textFromArray(
                  user.teamUsers
                    .map((team) => team.team.name)
                    .sort((a, b) => a.localeCompare(b))
                ),
                leaveName: textFromArray(
                  records.map((record) => {
                    const name = record.name;

                    return (
                      String.fromCodePoint(parseInt(name.split(" ")[0], 16)) +
                      " " +
                      name.split(" ").slice(1).join(" ")
                    );
                  })
                ),
                st: textFromArray(
                  records.map((record) => {
                    const type = record.st.split("_")[0];

                    return type[0] + type.slice(1).toLocaleLowerCase() + " day";
                  })
                ),
                start: textFromArray(
                  records.map((record) => {
                    const type = record.start.split("_")[0];

                    return type[0] + type.slice(1).toLocaleLowerCase();
                  })
                ),
                et: textFromArray(
                  records
                    .map((record) => {
                      if (!record.et) return "";

                      const type = record.et.split("_")[0];

                      return (
                        type[0] + type.slice(1).toLocaleLowerCase() + " day"
                      );
                    })
                    .filter((record) => record != "")
                ),
                end: textFromArray(
                  records
                    .map((record) => {
                      if (!record.end) return "";

                      const type = record.end.split("_")[0];

                      return type[0] + type.slice(1).toLocaleLowerCase();
                    })
                    .filter((record) => record != "")
                ),
                date: textFromArray(
                  records.map((rec) => {
                    return `${rec.et ? "From" : "On"} ${dayjs(
                      rec.start,
                      "YYYY-MM-DD"
                    ).format("D MMM YYYY")} - ${getLeaveTime(rec.st)} ${
                      rec.et
                        ? `to ${dayjs(rec.end, "YYYY-MM-DD").format(
                            "D MMM YYYY"
                          )} - ${getLeaveTime(rec.et)}`
                        : ""
                    }`;
                  })
                ),
              };
            });

          if (filteredUsers.length !== 0) {
            const text = getLeaveText(filteredUsers, true);

            slackMessages.push(
              slackClient.chat.postMessage({
                channel: weeklyLeaveSummary.channel,
                text,
              })
            );
          } else {
            const randomMessages = [
              "Full house this week. No one is on leave. :raised_hands::skin-tone-3:",
              "Squad’s complete. No one is on leave this week.",
              "Zero empty seats. No leaves this week.",
            ];

            const text =
              randomMessages[Math.floor(Math.random() * randomMessages.length)];
            slackMessages.push(
              slackClient.chat.postMessage({
                channel: weeklyLeaveSummary.channel,
                text,
              })
            );
          }
        }
      }

      const motivationalMessage =
        company.slackMotivationalMessage as unknown as MotivationalMessage;
      if (motivationalMessage?.on && currentTime == motivationalMessage.time) {
        const scheduledDate = dayjs(motivationalMessage.date, "YYYY-MM-DD").tz(
          timezone
        );

        if (
          motivationalMessage.frequency === ("Daily" as unknown as Frequency)
        ) {
          // Skip weekends if "Every Week Day" is selected
          if (
            motivationalMessage.dayOfNotification === "Every Weekday" &&
            isWeekEnd
          ) {
            continue;
          }
        } else if (
          motivationalMessage.frequency === ("Monthly" as unknown as Frequency)
        ) {
          // Check if today is the same day of the month
          if (today.date() !== scheduledDate.date()) {
            continue;
          }
        } else if (
          motivationalMessage.frequency === ("Weekly" as unknown as Frequency)
        ) {
          // Check if today's name matches any in the notification days
          const todayName = today.format("dddd"); // e.g., "Monday"
          if (motivationalMessage.dayOfNotification !== todayName) {
            continue;
          }
        } else if (
          motivationalMessage.frequency ===
          ("Fortnightly" as unknown as Frequency)
        ) {
          const diffInDays = today.diff(scheduledDate, "day");
          if (diffInDays % 15 !== 0) {
            continue;
          }
        }

        slackMessages.push(
          ...allUsers.map((user) =>
            slackClient.chat.postMessage({
              channel: user.slackId!,
              text: getQuotes(),
            })
          )
        );
      }
    }

    await Promise.all(slackMessages);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Unexpected error occured!",
      },
      { status: 500 }
    );
  }
}

const textFromArray = (arr: string[]) => {
  return arr.length === 1
    ? arr[0]
    : arr.slice(0, -1).join(", ") + " and " + arr[arr.length - 1];
};

const getLeaveText = (names, weekly = false) => {
  let text = "";

  const userText = (user) => {
    let text = "";

    if (!weekly)
      text =
        "  \n> :point_right: *" +
        user.team +
        "*   \n> • *" +
        user.name +
        "* - " +
        user.leaveName +
        " - " +
        user.type;
    else
      text =
        "  \n> :point_right: *" +
        user.team +
        "*   \n> • *" +
        user.name +
        "* - " +
        user.leaveName +
        "\n> " +
        user.date;
    // dayjs(user.start, "YYYY-MM-DD").format("D MMM YYYY") +
    // " - " +
    // user.st +
    // " to  " +
    // dayjs(user.start, "YYYY-MM-DD").format("D MMM YYYY") +
    // " - " +
    // user.et;

    return text;
  };

  const is = names.length == 1;

  text =
    `:bell: *${names.length} person* ${is ? "is" : "are"} on leave ${
      weekly ? "this week" : "today"
    } \n ` + names.map((name) => userText(name)).join("\n");

  return text;
};

const getLeaveTime = (time: LeaveTime) => {
  const type = time.split("_")[0];

  return (
    type[0] +
    type.slice(1).toLocaleLowerCase() +
    (type == "FULL" ? " day" : " half")
  );
};

const birthdayGIFs = {
  abhilasha: "Birthday_zazzy_Abhilasha.webp",
  anushree: "Birthday_zazzy_Anushree.webp",
  dipti: "Birthday_zazzy_Dipti.webp",
  jay: "Birthday_zazzy_Jay.webp",
  priyanshu: "Birthday_zazzy_Priyanshu.webp",
  ganesh: "Birthday_zazzy_Ganesh.gif",
  krishna: "Birthday_zazzy_Krishna.webp",
  satyarth: "Birthday_zazzy_Satyarth.webp",
  pranav: "Birthday_zazzy_Pranav.webp",
  sameer: "Birthday_zazzy_Sameer.webp",
  shivani: "Birthday_zazzy_Shivani.webp",
  sudhanshu: "Birthday_zazzy_Sudhanshu.webp",
  shobhana: "Birthday_zazzy_Shobhana.webp",
  shalini: "Birthday_zazzy_Shalini.webp",
};

const anniversaryGIFs = {
  pranav: "Anniversary_zazzy_Pranav.webp",
  krishna: "Anniversary_zazzy_Krishna.webp",
  sameer: "Anniversary_zazzy_Sameer.webp",
  satyarth: "Anniversary_zazzy_Satyarth.webp",
  dipti: "Anniversary_zazzy_Dipti.webp",
  ganesh: "Anniversary_zazzy_Ganesh.webp",
  sudhanshu: "Anniversary_zazzy_Sudhanshu.webp",
  anushree: "Anniversary_zazzy_Anushree.webp",
  abhilasha: "Anniversary_zazzy_Abhilasha.webp",
  shobhana: "Anniversary_zazzy_Shobhana.webp",
  shalini: "Anniversary_zazzy_Shalini.webp",
  priyanshu: "Anniversary_zazzy_Priyanshu.webp",
  shivani: "Anniversary_zazzy_Shivani.webp",
  jay: "Anniversary_zazzy_Jay.webp",
};

function getGIF(name, birthday = true) {
  // 1. Split at spaces; use the first word in lowercase
  const lowerFirstName = name.split(" ")[0].toLowerCase();

  // 2. Choose the appropriate dictionary
  const dictionary = birthday ? birthdayGIFs : anniversaryGIFs;

  // 3. Check if the first name includes any key in the dictionary
  for (const [key, fileName] of Object.entries(dictionary)) {
    if (lowerFirstName.includes(key)) {
      return `${birthday ? "Birthday" : "Workanniversary"}/zazzy/${fileName}`;
    }
  }

  // No match found
  const randomFileName = getRandomGIF(dictionary);
  return `${birthday ? "Birthday" : "Workanniversary"}/zazzy/${randomFileName}`;
}

function getRandomGIF(dictionary) {
  const values = Object.values(dictionary);
  return values[Math.floor(Math.random() * values.length)];
}

const getBirthdayAnniversaryText = (
  slackId,
  exp,
  workAnniversary,
  isBirthday = true
) => {
  const birthdayText = [
    `:tada: Another year, another adventure! It’s a special day! Let’s send <@${slackId}> a birthday love and make it extra special! :confetti_ball:`,
    `:birthday: Happy Birthday! Another year wiser, another year stronger! Let’s make <@${slackId}>'s day brighter with a warm wish! :confetti_ball:`,
    `:balloon: A toast to <@${slackId}>! Another year of awesomeness! Join us in wishing them a fantastic birthday filled with joy and success! :birthday:`,
    `:partying_face: A legend’s birthday! <@${slackId}> has been rocking both life and work for years. Let’s shower them with wishes for an epic year ahead! :birthday::confetti_ball:`,
    `:tada: Big cheers! It’s <@${slackId}>’s special day! Let’s make it extra memorable; send them a birthday wish! :birthday:`,
  ];

  const anniversaryText = [
    `:clap: A toast to new adventures ahead!! <@${slackId}> is celebrating their milestone with us. Here’s to many more! Drop a message and celebrate their journey! :rocket:`,
    `:sports_medal: Growing, thriving, excelling! <@${slackId}> has been with us for another incredible year! Let’s celebrate their journey and dedication! :confetti_ball:`,
    `:medal: A legacy in the making! <@${slackId}> has been shaping our journey for years! Let’s celebrate their dedication and impact today! :tada:`,
    `:trophy: A true milestone! <@${slackId}> has been an integral part of our story for over a decade! Let’s honor their journey and celebrate their legacy! :star2:`,
    `:clap: Milestone alert! <@${slackId}> is celebrating another amazing year with us! Join in the celebration and share your congratulations! :confetti_ball:`,
  ];

  let text = "";

  const getExpCategory = (exp) => {
    if (exp < 2) return 0;
    if (exp >= 2 && exp <= 5) return 1;
    if (exp >= 6 && exp <= 9) return 2;
    return 3;
  };

  const category = !workAnniversary ? 4 : getExpCategory(exp);

  if (isBirthday) {
    text = birthdayText[category];
    // .replace("-INSERT-ID-", `<@${slackId}>`);
  } else {
    text = anniversaryText[category];
    // .replace("-INSERT-ID-", `<@${slackId}>`);
  }

  return text;
};

const getQuotes = () => {
  const quotes = [
    {
      quote:
        "Drink water when you feel stressed, and you'll notice the change.",
      author: "~ Self-Care for People with ADHD",
    },
    {
      quote: "Courage comes first, and confidence emerges as a consequence.",
      author: "~ Why Has Nobody Told Me This Before?",
    },
    {
      quote:
        "Before jumping to conclusions, collect more information about a person to understand why they behaved in a specific manner.",
      author: "",
    },
    {
      quote:
        "Our biggest risk is inaction because when we do nothing, we miss an opportunity to learn and grow.",
      author: "",
    },
    {
      quote:
        "Leaders boast successful experiences, continually improve skills, and build deep relationships.",
      author: "",
    },
    {
      quote:
        "A good way to improve your skills is to observe and learn good techniques from others.",
      author: "",
    },
    {
      quote:
        "Treat your mind like the most sacred place - not every thought can come in and stay.",
      author: "",
    },
    {
      quote: "Incorporating fun into daily life is a part of self-care.",
      author: "~ You Will Get Through This Night",
    },
    {
      quote:
        "Knowing where and when to learn is critical for mastering new abilities.",
      author: "~ Frames of Mind",
    },
    {
      quote: "Character change is more sustainable than behavioral change.",
      author: "~ The 7 Habits of Highly Effective People",
    },
    {
      quote: "Believe you can, and you’re halfway there.",
      author: "– Theodore Roosevelt",
    },
    {
      quote:
        "Success is not final, failure is not fatal: It is the courage to continue that counts.",
      author: "– Winston Churchill",
    },
    {
      quote: "Do what you can, with what you have, where you are.",
      author: "– Theodore Roosevelt",
    },
    {
      quote: "The only way to do great work is to love what you do.",
      author: "– Steve Jobs",
    },
    {
      quote: "Difficult roads often lead to beautiful destinations.",
      author: "– Unknown",
    },
    {
      quote: "Opportunities don’t happen. You create them.",
      author: "– Chris Grosser",
    },
    {
      quote: "Don’t watch the clock; do what it does. Keep going.",
      author: "– Sam Levenson",
    },
    {
      quote: "Start where you are. Use what you have. Do what you can.",
      author: "– Arthur Ashe",
    },
    {
      quote: "It always seems impossible until it’s done.",
      author: "– Nelson Mandela",
    },
    {
      quote:
        "Small steps in the right direction can lead to the biggest change.",
      author: "- Unknown",
    },
  ];

  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  const formattedMessage = formatQuote(randomQuote.quote, randomQuote.author);

  return formattedMessage;
};

const formatQuote = (quote: string, author: string) => {
  const isType1 = author.trim().startsWith("~");
  const isType2 = author.trim().startsWith("–");

  const cleanAuthor = author.trim().replace(/^[-–~\s]+/, "");

  if (isType1) {
    // const cleanAuthor = author.replace(/^(\~|\–)\s*/, "");
    return `> “${quote}”\n\`\`\`\n${cleanAuthor}\n\`\`\``;
  } else if (isType2) {
    return `> “${quote}”\n> – ${cleanAuthor}`;
  } else {
    return `> “${quote}”`;
  }
};
//
