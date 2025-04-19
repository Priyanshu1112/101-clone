"use client";

import Typography from "@/app/(dashboard)/_components/Typography";
import Logo from "@/assets/Logo";
import { UserCircleBg } from "@/assets/UserCircle";
import { cn } from "@/lib/utils";
import useUserStore from "@/store/user";
import { calendarCodes } from "@/utils/constant/calendarCodes";
import { ArrowLeft, ArrowRight, CircleCheck } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import LoggedVia from "../_components/LoggedVia";
import { useRouter } from "next/navigation";
import { Input, Type } from "@/app/(dashboard)/_components/Input";
import Loader from "@/app/(dashboard)/_components/Loader";
import useAppStore from "@/store/app";

const TeamInvite = () => {
  const router = useRouter();
  const { user, company } = useUserStore();
  const { allUsers, getAllUsers } = useAppStore();
  const [value, setValue] = useState<string>("");
  const [fetching, setFetching] = useState<boolean>(false);

  const [members, setMembers] = useState<
    { id: string; name: string; email: string; image: string }[]
  >([]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  useEffect(() => {
    const getMembers = async () => {
      try {
        setFetching(true);
        const res = await fetch("/api/slack/all-members");

        if (res.ok) {
          const members = await res.json();
          // console.log({ members });
          setMembers(members);
        } else toast.error("Error fetching members!");

        setFetching(false);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Unexpect error occured!"
        );
      }
    };

    if (!allUsers && company) {
      getAllUsers(company?.id);
    }
    getMembers();
  }, [allUsers, company, getAllUsers]);

  const handleOnClick = (e) => {
    const childDiv = e.target.closest("[data-key]");
    if (childDiv) {
      const key = childDiv.dataset.key;

      if (!selectedMembers.includes(key)) {
        setSelectedMembers((prev) => [...prev, key]);
      } else {
        setSelectedMembers((prev) => prev.filter((item) => item !== key));
      }
    }
  };

  const handleContinue = async () => {
    const id = toast("Sending invite...", { duration: Infinity });

    const res = await fetch("/api/slack/invite", {
      method: "POST",
      body: JSON.stringify({ selectedMembers }),
    });

    if (res.ok) {
      toast.success("Team members invited successfully!");
      router.push("/");
    } else toast.error("Error sending invite!");

    toast.dismiss(id);
  };

  return (
    <div>
      <Logo width={108} height={48} />
      <div className="flex mt-[51px] items-center gap-5">
        <UserCircleBg code={calendarCodes[user?.colorCode ?? 0]} />
        <Typography variant="heading1" className="text-black font-semibold">
          {user?.name}. Let&apos;s invite your team memebers.
        </Typography>
      </div>

      <div className="mt-[22px] flex gap-5 items-center">
        <Input
          type={Type.Search}
          value={value}
          setValue={setValue}
          placeholder="Search your team members"
          containerClass="w-[597px]"
        />
        <span>
          <Typography
            variant="paragraph2"
            className="font-bold text-grey/500"
            text="Select all members"
          />
          <Typography
            variant="label"
            className="font-bold text-grey/400"
            text={`${selectedMembers.length ?? 0} members selected`}
          />
        </span>
      </div>
      {!fetching ? (
        <div
          onClick={handleOnClick}
          className="mt-4 grid grid-cols-2 gap-x-9 gap-y-4 bg-y max-h-96 overflow-auto no-scrollbar"
        >
          {members
            .filter((member) => {
              const matchesSearch = member.name
                .toLowerCase()
                .startsWith(value.toLowerCase());
              const isNotInAllUsers = !allUsers?.find(
                (user) => user.slackId === member.id
              );
              return matchesSearch && isNotInAllUsers;
            })
            .sort((a, b) => a.name.localeCompare(b.name)) // Proper string comparison
            .map((member) => {
              const isSelected = selectedMembers.includes(member.id);

              return (
                <div
                  key={member.id}
                  data-key={member.id}
                  className={cn(
                    "p-2 rounded-[7px] border flex gap-2 cursor-pointer",
                    isSelected ? "border-success-400" : "border-grey-300"
                  )}
                >
                  <Image
                    width={48}
                    height={48}
                    src={member.image}
                    alt="Profile Image"
                    className="rounded-[6px]"
                  />
                  <div className="flex justify-between items-center flex-1">
                    <span>
                      <Typography
                        variant="paragraph2"
                        text={member.name}
                        className="text-grey/500"
                      />
                      <Typography
                        variant="paragraph3"
                        text={member.email}
                        className="text-grey/400"
                      />
                    </span>
                    {isSelected && <CircleCheck size={24} color="#2C6E49" />}
                  </div>
                </div>
              );
            })}
        </div>
      ) : (
        <div className="w-full flex items-center justify-center py-28">
          <Loader />
        </div>
      )}
      <div className="mt-6 flex justify-between">
        <LoggedVia />

        <span className="flex gap-6">
          <button
            onClick={() => {
              router.back();
            }}
            className={`cursor-pointer text-gray-700 bg-white border-grey-300  flex items-center justify-center py-3 px-[18px] gap-[6px] border rounded-[8px]`}
            style={{
              boxShadow: "0px 1px 2px 0px #1018280D",
            }}
          >
            <ArrowLeft size={20} />
            <Typography
              text="Back"
              variant="paragraph2"
              className="font-semibold"
            />
          </button>
          <button
            onClick={handleContinue}
            disabled={selectedMembers.length == 0}
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
        </span>
      </div>
    </div>
  );
};

export default TeamInvite;
