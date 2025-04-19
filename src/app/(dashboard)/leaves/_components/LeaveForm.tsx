"use client";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ArrowRight, CalendarPlus2, Sparkle, Undo2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import dayjs from "dayjs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import Typography from "../../_components/Typography";
import useLeaveStore from "@/store/leave";
import useUserStore from "@/store/user";
import { LeaveTime, Role } from "@prisma/client";
import { toastFullfilled, toastPending } from "../../_components/Toast";
import useAppStore from "@/store/app";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { formatToSlackEmoji } from "@/app/api/_utils/getSlackEmojiText";
import { getDeducted } from "@/utils/helpers/getDeductes";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

const leave = ["Full Day", "1st half", "2nd half"];
const leaveTime = [
  LeaveTime.FULL_DAY,
  LeaveTime.FIRST_HALF,
  LeaveTime.SECOND_HALF,
];

const formSchema = z.object({
  start: z.object({
    date: z.string(),
    type: z.enum(["Full Day", "1st half", "2nd half"]),
  }),
  end: z
    .object({
      date: z.string(),
      type: z.enum(["Full Day", "1st half", "2nd half"]),
    })
    .optional(),
  leaveDetailId: z.string(),
  reason: z.string().optional(),
  member: z.string().optional(),
});

const LeaveForm = ({
  isTimeLeave = true,
  setOpen,
  start = dayjs().format("YYYY-MM-DD"),
}: {
  isTimeLeave: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  start?: string;
}) => {
  const { applyLeave, resetFetch } = useLeaveStore();
  const { user, teams, members, leaveDetail } = useUserStore();
  const { allUsers } = useAppStore();

  const currendYear = dayjs().tz("Asia/Kolkata").year();

  const isLead = teams?.some(
    (team) => team.role == Role.Lead && team.userId == user?.id
  );
  const leadTeams = teams
    ?.map((team) => {
      if (team.role == Role.Lead && team.userId == user?.id) return team.teamId;
    })
    .filter(Boolean);

  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  // leadTeams?.leads?.some((lead) => lead.id === user?.id) ?? false;

  const [endOpen, setEndOpen] = useState<boolean>(false);
  const [startOpen, setStartOpen] = useState<boolean>(false);

  useEffect(() => {
    resetFetch();

    return () => resetFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      start: { date: start, type: leave[0] },
      end: { date: "", type: leave[0] },
      leaveDetailId: "",
      reason: "",
      member: "",
    },
  });

  const formData = form.watch();

  const onSubmit = async (event) => {
    event.preventDefault();

    if (!isTimeLeave && !formData.leaveDetailId) {
      formData.leaveDetailId = "COMP";
    }

    const validation = formSchema.safeParse(formData);
    if (!validation.success) {
      // If validation fails, log the error messages
      validation.error.errors.forEach(() => {
        toast.error(`All field is required or invalid.`);
      });
      return;
    }

    const currLD = leaveDetail?.find((ld) => ld.id == formData.leaveDetailId);

    const activeDetail = currLD?.detail.find(
      (d) => d.year == currendYear.toString()
    );

    const st = leaveTime[leave.indexOf(formData.start.type)];
    const et = formData.end?.type
      ? leaveTime[leave.indexOf(formData.end.type)]
      : undefined;

    const deducted = getDeducted(
      formData.start.date,
      formData.end.date,
      st,
      et,
      dayjs(formData.end.date, "YYYY-MM-DD").isValid()
    );

    if (deducted > Number(activeDetail?.balance ?? currLD?.allowance))
      return toast.error(
        `Balance : ${
          activeDetail?.balance ?? currLD?.allowance
        } day(s) | Applied for : ${deducted} day(s)`
      );

    // return;
    const autoApprove =
      members?.some((member) => leadTeams?.includes(member.teamId)) ||
      user?.role == "Owner";

    const toastId = toastPending("Applying Leave...");
    const res = await applyLeave(
      user?.id ?? "",
      formData,
      autoApprove,
      deducted
    );

    toastFullfilled(
      toastId,
      res,
      "Leave applied successfully!",
      "Error applying leave",
      setOpen
    );
  };

  return (
    <div className="mt-9 flex-1">
      <Form {...form}>
        <form className="flex flex-col gap-6 h-full" onSubmit={onSubmit}>
          {(user?.role == Role.Administrator || user?.role == Role.Owner) && (
            <Select
              value={formData.member}
              onValueChange={(value) => {
                form.setValue("member", value);
                members?.forEach((member) => {
                  if (member.userId == value)
                    setSelectedMember(member.user.name);
                });
              }}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder="Select a member"
                  className="capitalize"
                />
              </SelectTrigger>
              <SelectContent>
                {allUsers
                  ?.sort((a, b) => a.name.localeCompare(b.name))
                  .map((member, index) => {
                    return (
                      <SelectItem
                        value={member.id}
                        key={index}
                        className="capitalize"
                      >
                        {member.name} {member.id == user?.id && "(You)"}
                      </SelectItem>
                    );
                  })}
              </SelectContent>
            </Select>
          )}

          <div className="pt-1 px-3 pb-4 border rounded-md flex flex-col gap-3 text-grey/400">
            <Typography
              variant="paragraph3"
              text={"Select date"}
              className="text-grey/400 font-semibold"
            />

            <Popover
              open={startOpen}
              onOpenChange={(value) => setStartOpen(value)}
            >
              <PopoverTrigger className="focus:outline-none">
                <div className="pb-6 flex gap-8 border-b border-[#D0D5DD] items-center">
                  <span className="flex flex-col items-start">
                    <Typography
                      variant="label"
                      text={formData.end.date ? "FROM" : "ON"}
                      className="font-bold text-dark"
                    />
                    <Typography
                      variant="paragraph2"
                      text={dayjs(formData.start.date).format("MMM D")}
                      className="font-bold text-dark"
                    />
                  </span>
                  <span className="flex gap-3 items-center">
                    {leave
                      .filter((item) =>
                        formData.end.date ? item !== "1st half" : true
                      )
                      .map((item, index) => {
                        const isActive = item == formData.start.type;

                        return (
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              form.setValue("start.type", item);
                            }}
                            key={index}
                            className={`cursor-pointer py-1 px-4 rounded-[53px] border flex items-center justify-center transition-all ${
                              isActive
                                ? "border-secondary-400-main bg-success-100 "
                                : "border-grey-300"
                            }`}
                          >
                            {" "}
                            <Typography
                              variant="paragraph3"
                              text={item}
                              className={`${
                                isActive
                                  ? "text-secondary-600"
                                  : "text-grey/400"
                              }`}
                            />{" "}
                          </div>
                        );
                      })}
                  </span>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  onSelect={(selectedDate) => {
                    const selectedEndDate = dayjs(selectedDate);
                    const endDate = dayjs(formData.end.date);

                    if (!selectedEndDate.isAfter(endDate)) {
                      form.setValue(
                        "start.date",
                        dayjs(selectedDate).format("YYYY-MM-DD")
                      ); // Set the end date
                      setStartOpen(false);
                    } else {
                      toast.error("End date must be greater than start date.");
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Popover open={endOpen} onOpenChange={(value) => setEndOpen(value)}>
              <PopoverTrigger>
                {formData.end.date ? (
                  <div className="pb-6 flex gap-8 border-b border-[#D0D5DD] items-center">
                    <span className="flex flex-col items-start">
                      <Typography
                        variant="label"
                        text={"TO"}
                        className="font-bold text-dark"
                      />
                      <Typography
                        variant="paragraph2"
                        text={dayjs(formData.end.date).format("MMM D")}
                        className="font-bold text-dark"
                      />
                    </span>
                    <span className="flex gap-3 items-center">
                      {leave
                        .filter((item) => item !== "2nd half")
                        .map((item, index) => {
                          const isActive = item == formData.end.type;

                          return (
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                form.setValue("end.type", item);
                              }}
                              key={index}
                              className={`cursor-pointer py-1 px-4 rounded-[53px] border flex items-center justify-center transition-all ${
                                isActive
                                  ? "border-secondary-400-main bg-success-100 "
                                  : "border-grey-300"
                              }`}
                            >
                              {" "}
                              <Typography
                                variant="paragraph3"
                                text={item}
                                className={`${
                                  isActive
                                    ? "text-secondary-600"
                                    : "text-grey/400"
                                }`}
                              />{" "}
                            </div>
                          );
                        })}
                    </span>
                    <Typography
                      variant="paragraph3"
                      className="font-bold flex items-center gap-1 text-secondary-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        form.setValue("end.date", "");
                      }}
                    >
                      <Undo2 size={20} />
                      Cancel
                    </Typography>
                  </div>
                ) : (
                  <div className="flex gap-3 items-center cursor-pointer">
                    <CalendarPlus2 size={24} />{" "}
                    <span className="flex gap-2">
                      <Typography
                        variant="paragraph3"
                        text="Add end date"
                        className="font-bold text-dark"
                      />
                      <Typography
                        variant="paragraph3"
                        text="(for multi-days leaves)"
                        className="text-grey/400 font-bold"
                      />
                    </span>
                  </div>
                )}
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  onSelect={(selectedDate) => {
                    const selectedEndDate = dayjs(selectedDate);
                    const startDate = dayjs(formData.start.date);

                    if (selectedEndDate.isAfter(startDate)) {
                      form.setValue(
                        "end.date",
                        selectedEndDate.format("YYYY-MM-DD")
                      ); // Set the end date
                      setEndOpen(false);
                    } else {
                      toast.error("End date must be greater than start date.");
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {isTimeLeave && (
            <div className="pt-1 px-3 pb-4 border rounded-md flex flex-col gap-[6px] text-grey/400">
              <Typography
                variant="paragraph3"
                className="font-semibold text-grey/400"
                text={"Select leave type"}
              />

              <Select
                onValueChange={(e) => {
                  form.setValue("leaveDetailId", e);
                }}
              >
                <SelectTrigger className="w-full rounded-[8px]">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {leaveDetail?.map((ld, index) => {
                    const name = formatToSlackEmoji(ld.name).replace(/\*/g, "");

                    const unlimited = ld.unlimited;

                    const activeDetail = unlimited
                      ? null
                      : ld.detail.find((d) => d.year == currendYear.toString());

                    const option =
                      name +
                      (unlimited
                        ? ""
                        : " (" + (activeDetail?.balance ?? ld.allowance) + ")");
                    return (
                      <SelectItem
                        key={index}
                        value={ld.id}
                        className="uppercase"
                      >
                        {option}
                      </SelectItem>
                    );
                  })}
                  {/* {leavePolicy?.map((policy, index) => {
                    if (
                      ((leadTeams?.length ?? 0) > 0
                        ? members?.find(
                            (member) =>
                              member.userId == form.getValues("member")
                          )?.user.gender == "Male"
                        : user?.gender == "Male") &&
                      policy.name.includes("Menstrual")
                    )
                      return <React.Fragment key={index}></React.Fragment>;
                    return (
                      <SelectItem
                        key={index}
                        value={policy.id}
                        className="uppercase"
                      >
                        {renderStringWithEmoji(policy.name)}
                      </SelectItem>
                    );
                  })} */}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="pt-1 px-3 pb-4 border rounded-md flex flex-col gap-[6px] text-grey/400">
            <Typography
              variant="paragraph3"
              className="font-semibold text-grey/400"
              text={"Add a leave reason (Optional)"}
            />
            <input
              type="text"
              placeholder="Enter a reason for leave"
              value={formData.reason}
              onChange={(e) => {
                form.setValue("reason", e.target.value);
              }}
              className="py-2 px-3 rounded-[8px] border"
            />
          </div>

          {((isLead && selectedMember) ||
            user?.role == "Administrator" ||
            user?.role == "Owner") && (
            <div className="max-w-[429px] px-3 py-2 bg-main-100 border border-warning/400 rounded-[5px] flex items-start gap-4">
              <Sparkle size={20} />
              <Typography variant="paragraph2">
                As the designated approver, this leave request will be
                automatically approved.
              </Typography>
            </div>
          )}

          <div
            id="actions"
            className="w-full flex items-end gap-4 justify-end mt-auto sticky bottom-0 bg-white pt-2"
          >
            <button
              type="button"
              onClick={() => {
                setOpen(false);
              }}
              className="px-5 py-3 border border-error-400 rounded-[8px]"
            >
              <Typography
                text="Discard"
                variant="paragraph2"
                className="font-semibold text-error-600"
              />
            </button>
            <button
              type="submit"
              className="px-5 py-3 border rounded-[8px] bg-secondary-400-main flex items-center gap-[6px] text-secondary-200"
            >
              <Typography
                text="Apply leave"
                variant="paragraph2"
                className="font-semibold text-secondary-100"
              />
              <ArrowRight size={20} />
            </button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default LeaveForm;
