"use client";
import Logo from "@/assets/Logo";
import { UserCircleBg } from "@/assets/UserCircle";
import { calendarCodes } from "@/utils/constant/calendarCodes";
import Typography from "@/app/(dashboard)/_components/Typography";
import Slack from "@/assets/Slack";
import { ArrowRight, CircleCheck } from "lucide-react";

import { useEffect, useState } from "react";
import useUserStore from "@/store/user";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import LoggedVia from "./_components/LoggedVia";
import NotifyAdmin from "./_components/NotifyAdmin";
import Illustration from "../_components/Illustration";

const Onboarding = () => {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [teamName, setTeamName] = useState<string>("");
  const [teamMember, setTeamMember] = useState<string>("");
  const { user, company, finishOnboarding, finishingOnboarding } =
    useUserStore();
  const router = useRouter();

  const handleContinue = () => {
    if (!teamName || !teamMember)
      return toast.error("All the fields are required to continue!");

    finishOnboarding(teamName, teamMember);
  };

  useEffect(() => {
    let toastID: string | number;
    if (finishingOnboarding == "pending")
      toastID = toast.info("Updating company...", { duration: Infinity });
    else if (finishingOnboarding == "success") {
      toast.success("Company updated successfully!");
      router.push("/onboarding/team-invite");
    } else if (finishingOnboarding == "error")
      toast.success("Error updating compnay!");

    return () => {
      if (toastID) toast.dismiss(toastID);
    };
  }, [finishingOnboarding, router]);

  return (
    <>
      <>
        <div className="flex gap-[169px] items-center">
          <div>
            <Logo width={108} height={48} />
            {/* greeting */}
            <div className="flex mt-[51px] items-center gap-5">
              <UserCircleBg code={calendarCodes[user?.colorCode ?? 0]} />
              <Typography
                variant="heading1"
                className="text-black font-semibold"
              >
                Hey, <span className="capitalize">{user?.name}.</span>
                Let&apos;s set up your team.
              </Typography>
            </div>
            {/* form */}
            <div className="mt-16 flex flex-col gap-[38px] max-w-[385px]">
              <div>
                <Typography
                  variant="paragraph3"
                  className="font-medium text-grey/500"
                  text="Company name"
                />
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="Enter team name"
                  className="py-[10px] px-[14px] rounded-[8px] border border-grey-300 focus:outline-none w-full mt-[6px]"
                  style={{
                    boxShadow: "0px 1px 2px 0px #1018280D",
                  }}
                />
              </div>
              <div>
                <Typography
                  variant="paragraph3"
                  className="font-medium text-grey/500"
                  text="How big is your team?"
                />
                <input
                  type="number"
                  value={teamMember}
                  onChange={(e) => setTeamMember(e.target.value)}
                  placeholder="Select number of employees"
                  className="py-[10px] px-[14px] rounded-[8px] border border-grey-300 focus:outline-none w-full mt-[6px]"
                  style={{
                    boxShadow: "0px 1px 2px 0px #1018280D",
                  }}
                />
              </div>
              <div className="mt-[57px]">
                {company?.slackTeamId ? (
                  <>
                    <div
                      className="py-[10px] px-4 rounded-[8px] flex justify-center items-center gap-3 text-dark w-full cursor-pointer border border-grey-300"
                      style={{
                        boxShadow: "0px 6px 12px 0px rgba(16, 24, 40, 0.09)",
                      }}
                    >
                      <Slack />
                      <Typography
                        variant="paragraph2"
                        text={`Logged in as ${company.slackTeamName}`}
                        className="font-semibold"
                      />
                    </div>
                    <Typography
                      variant="paragraph2"
                      className="text-grey/400 font-semibold flex gap-2 p-2"
                    >
                      <CircleCheck size={20} /> Slack connected successfully.
                    </Typography>
                  </>
                ) : (
                  <>
                    <Link
                      href={
                        "https://slack.com/oauth/v2/authorize?client_id=1289625137399.8217391215255&scope=channels:history,channels:read,channels:write.invites,chat:write,chat:write.public,commands,groups:history,groups:read,groups:write,im:history,im:read,im:write,incoming-webhook,mpim:history,mpim:read,mpim:write,users:read,users:read.email&user_scope="
                        // "https://slack.com/oauth/v2/authorize?client_id=7982655779670.8018292032832&scope=channels:history,channels:write.invites,chat:write,chat:write.public,commands,groups:history,groups:write,im:history,im:write,mpim:history,mpim:write,users:read.email,users:read&user_scope=chat:write,users:read,users:read.email,channels:history,channels:write,im:history,mpim:history"
                      }
                      className="bg-dark py-[10px] px-4 rounded-[8px] flex justify-center items-center gap-3 text-white w-full"
                    >
                      <Slack />
                      <Typography
                        variant="paragraph2"
                        text="Connect your team Slack"
                        className="font-semibold"
                      />
                    </Link>
                    <NotifyAdmin
                      dialogOpen={dialogOpen}
                      setDialogOpen={setDialogOpen}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
          <Illustration />
        </div>
        {/* status */}
        <div className="mt-[72px] flex justify-between">
          <LoggedVia />

          <button
            onClick={handleContinue}
            disabled={!teamMember || !teamName}
            className={`cursor-pointer disabled:text-grey-300 text-main-400 disabled:cursor-not-allowed bg-secondary-400-main disabled:bg-white border-secondary-400-main  flex items-center justify-center py-3 px-[18px] gap-[6px] border disabled:border-[#EAECF0] rounded-[8px]`}
            style={{
              boxShadow: "0px 1px 2px 0px #1018280D",
            }}
          >
            <Typography
              text="Continue"
              variant="paragraph2"
              className="font-semibold"
            />
            <ArrowRight size={20} />
          </button>
        </div>
      </>
    </>
  );
};

export default Onboarding;
