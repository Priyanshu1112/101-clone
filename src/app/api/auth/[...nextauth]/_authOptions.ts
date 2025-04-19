import { peopleService, setService } from "@/service/google";
import { prisma } from "@/service/prisma";
import {
  // AllowanceType,
  Company,
  Gender,
  NotificationType,
  // LeaveType,
  Provider,
  Role,
  User,
} from "@prisma/client";
import { people_v1 } from "googleapis";
import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import SlackProvider from "next-auth/providers/slack";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          scope: [
            "https://www.googleapis.com/auth/userinfo.email",
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/calendar",
            "https://www.googleapis.com/auth/user.gender.read",
            "https://www.googleapis.com/auth/user.birthday.read",
            "openid",
          ].join(" "),
        },
      },
    }),
    SlackProvider({
      clientId:
        process.env.NODE_ENV === "production"
          ? process.env.SLACK_CLIENT_ID || ""
          : process.env.SLACK_CLIENT_ID_LM || "",
      clientSecret:
        process.env.NODE_ENV === "production"
          ? process.env.SLACK_CLIENT_SECRET || ""
          : process.env.SLACK_CLIENT_SECRET_LM || "",
      checks: "none",
      authorization: {
        params: {
          scope: "openid email profile",
        },
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      const [isGoogle, isSlack] = [
        account?.provider == "google",
        account?.provider == "slack",
      ];

      await setService(account?.access_token ?? "");

      try {
        const userDb = await prisma.user.findUnique({
          where: {
            email: user.email ?? "",
          },
        });

        if (userDb) {
          const updates: Promise<User>[] = [];

          if (isGoogle) {
            updates.push(
              prisma.user.update({
                where: { id: userDb.id },
                data: { lastSignInProvider: Provider.Google },
              })
            );
          } else if (isSlack)
            updates.push(
              prisma.user.update({
                where: { id: userDb.id },
                data: { lastSignInProvider: Provider.Slack },
              })
            );

          if (isGoogle && !userDb.googleId) {
            updates.push(
              prisma.user.update({
                where: { id: userDb.id },
                data: { googleId: user.id },
              })
            );
          } else if (isSlack && !userDb.slackId) {
            updates.push(
              prisma.user.update({
                where: { id: userDb.id },
                data: { slackId: user.id },
              })
            );
          }

          await Promise.all(updates);
        } else {
          let peopleData: people_v1.Schema$Person | null = null;

          if (peopleService) {
            try {
              const { data } = await peopleService.people.get({
                resourceName: "people/me",
                personFields: "genders,birthdays", // Specify the fields you need
              });

              peopleData = data;
            } catch (error) {
              console.error("Error fetching people data:", error);
              peopleData = null;
            }
          }

          const domain = user.email?.split("@")[1];
          let userId: string | null = null;

          const company = await prisma.company.findUnique({
            where: { domain },
            select: {
              id: true,
              createdById: true,
              createdBy: { select: { name: true } },
            },
          });

          let newCompany: Company | null = null;

          const createBody = {
            email: user.email ?? "",
            name: user.name ?? "",
            colorCode: Math.floor(Math.random() * 15),
            gender:
              peopleData?.genders?.[0]?.formattedValue === "Male"
                ? Gender.Male
                : peopleData?.genders?.[0]?.formattedValue === "Female"
                ? Gender.Female
                : null, // Default to Male if no data is available
            birthday: peopleData?.birthdays?.[0]?.date
              ? `${String(peopleData.birthdays[0].date.day ?? "").padStart(
                  2,
                  "0"
                )}/${String(peopleData.birthdays[0].date.month ?? "").padStart(
                  2,
                  "0"
                )}/${peopleData.birthdays[0].date.year ?? ""}`
              : "", // Empty string if no birthday is available
            ...(company ? { companyId: company.id } : {}),
            approverId: company?.createdById,
            needsOnboarding: true,
          };

          if (isGoogle) {
            const { id } = await prisma.user.create({
              data: {
                googleId: user.id ?? "",
                ...createBody,
                lastSignInProvider: Provider.Google,
              },
            });

            userId = id;
          } else if (isSlack) {
            const { id } = await prisma.user.create({
              data: {
                slackId: user.id ?? "",
                ...createBody,
                lastSignInProvider: Provider.Slack,
              },
            });

            userId = id;
          }

          if (userId && company) {
            const admins = await prisma.user.findMany({
              where: { role: Role.Owner, companyId: company.id },
              select: { id: true },
            });

            await prisma.notification.create({
              data: {
                type: NotificationType.Onboard,
                users: { connect: admins },
                for: admins.map((admin) => admin.id),
                title: `${user.name} onboarded to 101!`,
                text: `${user.name} has joined 101, with ${company.createdBy.name} as approver!`,
              },
            });
          }

          if (userId && !company) {
            newCompany = await prisma.company.create({
              data: {
                domain: domain ?? "",
                createdById: userId,
              },
            });

            await prisma.user.update({
              where: { id: userId },
              data: {
                role: Role.Administrator,
                companyId: newCompany.id,
                needsOnboarding: true,
              },
            });
          }

          // BY DEFAULT ADD MEMBERS TO TEAM ZAZZY
          // if (userId) {
          //   await prisma.teamUser.create({
          //     data: { userId, teamId: "e9e9975c-88ad-4501-b3a2-803ed0396da8" },
          //   });
          // }
        }

        return true;
      } catch (err) {
        console.log(
          "sign-in-error=====",
          err instanceof Error
            ? { msg: err.message, cause: err.cause, name: err.name }
            : "Error"
        );
        return false;
      }
    },

    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken;
      await setService(session.accessToken ?? "");

      const user = await prisma.user.findUnique({
        where: { email: session.user?.email ?? "" },
        include: {
          approver: { select: { id: true, name: true } },
          company: true,
          teamUsers: {
            include: {
              team: {
                select: { name: true, workDay: { select: { workWeek: true } } },
              },
            },
          },
        },
      });

      if (!user) return session;

      const teamIds = user?.teamUsers.map((team) => team.teamId) ?? [];

      const teamUsers = await Promise.all(
        teamIds.map((teamId) =>
          prisma.teamUser.findMany({
            where: { teamId: teamId },
            include: {
              user: {
                select: {
                  name: true,
                  slackId: true,
                  googleId: true,
                  gender: true,
                },
              },
              team: {
                select: {
                  name: true,
                  workDay: { select: { workWeek: true } },
                },
              },
            }, // Include the user details if needed
          })
        )
      );

      const flatTeam = teamUsers.flatMap((teamUser) => teamUser);

      const customUser = { ...user, members: flatTeam };

      session.user = customUser!;
      return session;
    },
  },

  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/login?error=true",
  },

  secret: process.env.NEXTAUTH_SECRET,
  // debug: process.env.NODE_ENV === "development",
};
