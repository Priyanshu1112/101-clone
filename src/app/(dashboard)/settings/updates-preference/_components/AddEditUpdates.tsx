"use client";
import Typography from "@/app/(dashboard)/_components/Typography";
import { FormControl, FormField } from "@/components/ui/form";
import { SheetTitle } from "@/components/ui/sheet";
import useAppStore from "@/store/app";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import CustomFormItem from "../../_components/CustomFormItem";
import TimePicker from "./TimePicker";
import useTeamStore from "@/store/team";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { MembersDialog } from "../../team-management/_components/MembersDialog";
import { Edit, Plus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import useUpdateStore from "@/store/update";
import useUserStore from "@/store/user";
import CustomDialog from "@/app/(dashboard)/_components/CustomDialog";
import dayjs from "dayjs";
import {
  toastFullfilled,
  toastPending,
} from "@/app/(dashboard)/_components/Toast";
import {
  toastAdding,
  toastAddingError,
  toastAddingSuccess,
  toastDeleting,
  toastDeletingError,
  toastDeletingSuccess,
  toastUpdating,
} from "@/utils/constant/toastMessage";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const formSchema = z.object({
  time: z.string().min(1, "Time is required"),
  team: z.string().min(1, "Team selection is required"),
  questions: z.array(z.string()),
  channel: z.string().min(1, "Channel is required"),
});

const AddEditUpdates = ({
  isAdd,
  setOpen,
  teamName,
  teamId,
}: {
  isAdd: boolean;
  setOpen?: Dispatch<SetStateAction<boolean>>;
  teamName?: string;
  teamId?: string;
}) => {
  const { addUpdate, currentUpdate, update, deleteUpdate } = useUpdateStore();
  const { company } = useUserStore();
  const { teams } = useTeamStore();
  const { allUsers, channels } = useAppStore();
  const [members, setMembers] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [newQuestion, setNewQuestion] = useState("");
  const [edit, setEdit] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(".edit-question")) {
        setEdit("");
      }
    };

    // Add the event listener
    window.addEventListener("click", handleClick);

    // Cleanup the event listener on unmount
    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, []);

  useEffect(() => {
    if (!isAdd && currentUpdate?.members) {
      setMembers(currentUpdate?.members?.map((member) => member.id) ?? []);
    } else {
      if (teamId)
        setMembers(
          teams
            ?.find((team) => team.id == teamId)
            ?.members.map((member) => member.id) ?? []
        );
    }
  }, [isAdd, currentUpdate, teams, teamId]);

  const handleMemberToggle = (userId: string) => {
    setMembers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      time: isAdd ? "09:30:00" : currentUpdate?.time,
      team: isAdd ? teamId : currentUpdate?.teamId,
      questions: isAdd ? [] : currentUpdate?.questions,
      channel: isAdd ? "" : currentUpdate?.channelId,
    },
  });

  const formData = form.watch();

  const onSubmit = async () => {
    if (!(formData.questions.length > 0) || formData.team == "")
      return toast.error("Invalid form!");

    const toastId = toastPending(toastAdding("Update"));
    const res = await addUpdate({
      ...formData,
      members,
      company: company?.id ?? "",
    });
    toastFullfilled(
      toastId,
      res,
      toastAddingSuccess("Update"),
      toastAddingError("Update"),
      setOpen
    );
  };

  const onDelete = async () => {
    const toastId = toastPending(toastDeleting("Update"));
    const res = await deleteUpdate(currentUpdate?.id ?? "");

    toastFullfilled(
      toastId,
      res,
      toastDeletingSuccess("Update"),
      toastDeletingError("Update"),
      setOpen
    );
  };

  const onConfirm = async () => {
    if (!(formData.questions.length > 0) || formData.team == "")
      return toast.error("Invalid form!");

    const toastId = toastPending(toastUpdating("Update"));
    const res = await update({
      ...formData,
      members,
      id: currentUpdate?.id,
      company: company?.id ?? "",
    });
    toastFullfilled(
      toastId,
      res,
      toastAddingSuccess("Update"),
      toastAddingError("Update"),
      setOpen
    );
  };

  const addQuestion = () => {
    form.setValue("questions", [...form.getValues("questions"), newQuestion]);

    setNewQuestion("");
  };

  return (
    <>
      <SheetTitle className="pt-4 pl-6 sticky top-0 bg-white border-b border-grey-300 pb-5 z-10">
        <Typography
          variant="display4"
          text={!isAdd ? "Update" : "Add new calendar"}
        />
      </SheetTitle>
      <div className="mt-8 px-6 h-full">
        <FormProvider {...form}>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="relative h-full flex flex-col"
          >
            <div className="flex flex-col gap-[6px] text-grey/400">
              <Typography
                text="Time"
                variant="paragraph3"
                className="font-semibold "
              />
              <TimePicker form={form} />
            </div>
            <FormField
              control={form.control}
              name="team"
              render={({ field }) => {
                return (
                  <CustomFormItem label="Select team" className="mt-5">
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select team!" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {teams
                          ?.sort((a, b) => a.name.localeCompare(b.name))
                          .map((team) => {
                            return (
                              <SelectItem key={team.id} value={team.id}>
                                <div className="flex items-center gap-2">
                                  <Image
                                    src={team.logo || "/fav-icon.svg"}
                                    width={20}
                                    height={20}
                                    alt="logo"
                                  />{" "}
                                  {team.name}
                                </div>
                              </SelectItem>
                            );
                          })}
                      </SelectContent>
                    </Select>
                  </CustomFormItem>
                );
              }}
            />
            <div className="flex flex-col gap-[6px]">
              <Typography
                text="Add members"
                variant="paragraph3"
                className="text-grey/400 font-semibold mt-5"
              />
              <MembersDialog
                members={members}
                onToggle={handleMemberToggle}
                users={allUsers ?? []}
                search={search}
                setSearch={setSearch}
              />
            </div>
            <hr className="h-1 w-screen -mx-8 my-6" />
            <div className="flex flex-col gap-[6px]">
              <Typography
                text="Questions"
                variant="paragraph3"
                className="font-semibold "
              />
              {form.getValues("questions").map((question, index) => {
                return (
                  <div
                    key={index}
                    className={cn(
                      " flex gap-1 items-center py-[10px] px-[14px] rounded-[8px] border border-grey-300 shadow-sm edit-question",
                      !(index.toString() == edit) &&
                        "bg-[#F9FAFB] text-grey/400"
                    )}
                  >
                    <input
                      type="text"
                      value={question}
                      disabled={!(index.toString() == edit)}
                      onChange={(e) => {
                        const updatedQuestions = [
                          ...(form.getValues("questions") as string[]),
                        ];
                        updatedQuestions[index] = e.target.value;
                        form.setValue("questions", updatedQuestions); // Update the form state
                      }}
                      className="focus:outline-none bg-transparent flex-1 disabled:cursor-not-allowed"
                    />

                    <Edit
                      size={16}
                      onClick={() => setEdit(index.toString())}
                      className="edit-question cursor-pointer"
                    />
                    <Trash
                      size={16}
                      className="cursor-pointer text-error-500"
                      onClick={() => {
                        const updatedQuestions = [
                          ...(form.getValues("questions") as string[]),
                        ];

                        form.setValue(
                          "questions",
                          updatedQuestions.filter((_, qInd) => qInd != index)
                        );
                      }}
                    />
                  </div>
                );
              })}
              <div className="bg-white py-[10px] px-[14px] rounded-[8px] border border-grey-300 shadow-sm flex items-center gap-1">
                <input
                  type="text"
                  id="question"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value  )}
                  onKeyDown={(e) => {

                    if (e.key === "Enter") {
                      setNewQuestion(
                        (e.target as HTMLInputElement).value.trim()
                      );

                      addQuestion();
                    }
                  }}
                  className="focus:outline-none bg-transparent flex-1"
                  placeholder="Add question"
                />
                <button type="button" onClick={addQuestion}>
                  <Plus size={16} />
                </button>
              </div>
              <hr className="h-1 w-screen -mx-8 my-6" />
              <FormField
                control={form.control}
                name="channel"
                render={({ field }) => {
                  return (
                    <CustomFormItem label="Published to channel">
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Published to channel" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {channels?.map((channel) => {
                            return (
                              <SelectItem
                                key={channel.id}
                                value={channel.id ?? ""}
                              >
                                {channel.name}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </CustomFormItem>
                  );
                }}
              />
            </div>

            <div className="flex-grow"></div>

            <div className="py-6 bg-white mt-11 flex gap-6 items-center sticky bottom-0 left-0">
              {" "}
              <hr className="absolute top-0 -left-6 min-h-1 border-grey-300 w-[500px]" />
              {isAdd ? (
                <>
                  <Button
                    className="py-3 px-[18px] w-full bg-secondary-white text-gray-700 border border-grey-300 hover:bg-secondary-100/80"
                    type="button"
                    onClick={() => {
                      if (setOpen) setOpen(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="py-3 px-[18px] w-full bg-secondary-400-main text-main-400 border-secondary-400-main hover:bg-secondary-300"
                    type="button"
                    onClick={onSubmit}
                  >
                    Create
                  </Button>
                </>
              ) : (
                <>
                  <CustomDialog
                    open={deleteOpen}
                    setOpen={setDeleteOpen}
                    dialogHeadDesc={`You're about to delete the ${dayjs(
                      "2023-01-01 " + currentUpdate?.time
                    ).format(
                      "h:mm A"
                    )} update notification for the ${teamName} team of ${
                      currentUpdate?.members?.length ?? 0
                    } members. This action cannot be undone.`}
                    dialogHeadText="Are you sure?"
                    action={
                      <Button
                        className="py-3 px-[18px] flex-1 bg-error-300 text-white border-error-300 hover:bg-error-400"
                        type="button"
                        onClick={onDelete}
                      >
                        Delete
                      </Button>
                    }
                  >
                    <Button
                      className="py-3 px-[18px] w-full bg-error-300 text-white border-error-300 hover:bg-error-400"
                      type="button"
                    >
                      Delete CheckIn
                    </Button>
                  </CustomDialog>
                  <Button
                    onClick={onConfirm}
                    className="py-3 px-[18px] w-full bg-secondary-400-main text-main-400 border-secondary-400-main hover:bg-secondary-300"
                    type="button"
                  >
                    Confirm
                  </Button>
                </>
              )}
            </div>
          </form>
        </FormProvider>
      </div>
    </>
  );
};

export default AddEditUpdates;
