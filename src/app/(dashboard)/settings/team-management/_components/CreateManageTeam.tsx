"use client";

import Typography from "@/app/(dashboard)/_components/Typography";
import { Form, FormControl, FormField } from "@/components/ui/form";
import { SheetTitle } from "@/components/ui/sheet";
import { zodResolver } from "@hookform/resolvers/zod";
import React, {
  Dispatch,
  SetStateAction,
  useMemo,
  useRef,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import CustomFormItem from "../../_components/CustomFormItem";
import { ImagePlus } from "lucide-react";
import { toast } from "sonner";
import TeamLogo from "@/app/(dashboard)/team/_components/TeamLogo";
import { Input } from "@/components/ui/input";
import useAppStore from "@/store/app";
import { MembersDialog } from "./MembersDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import useCalendarStore from "@/store/calendar";
import useTeamStore from "@/store/team";
import { cn } from "@/lib/utils";
import { Role } from "@prisma/client";
import CustomDialog from "@/app/(dashboard)/_components/CustomDialog";
import { FetchStatus } from "@/store/leave";
import {
  toastFullfilled,
  toastPending,
} from "@/app/(dashboard)/_components/Toast";

const formSchema = z.object({
  logo: z.string(),
  name: z.string(),
  approver: z.string(),
  calendar: z.string(),
  workday: z.string(),
  checkIn: z.string(),
});

const CreateManageTeam = ({
  isCreate = false,
  setOpen,
}: {
  isCreate?: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const { allUsers } = useAppStore();
  const { calendar } = useCalendarStore();
  const { workDays, createTeam, currentTeam, updateTeam, deleteTeam } =
    useTeamStore();
  const [search, setSearch] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [members, setMembers] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const team = useMemo(() => {
    if (!isCreate && currentTeam) {
      setMembers(currentTeam?.members?.map((member) => member.id) || []);
      return currentTeam;
    }
    return null;
  }, [isCreate, currentTeam]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: team?.name || "",
      logo: team?.logo || "",
      approver:
        team?.members?.find((member) => member.role === Role.Lead)?.id || "",
      calendar: (team?.calendar?.length ?? 0) > 0 ? team?.calendar[0]?.id : "",
      workday: (team?.workDay.length ?? 0) > 0 ? team?.workDay[0]?.id : "",
      checkIn: "Demo",
    },
  });

  const formData = form.watch();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file = e.target.files?.[0];
    if (file && file.type === "image/svg+xml") {
      const reader = new FileReader();
      reader.onload = () => {
        const logoString = reader.result as string;
        if (logoString) {
          form.setValue("logo", logoString);
        }
      };
      reader.readAsDataURL(file);
    } else {
      toast.error("Please upload a valid SVG file.");
    }
  };

  const onSubmit = async () => {
    const validate = formSchema.safeParse(formData);

    if (!validate.success) return toast.error("Invalid form!");

    const toastId = toastPending("Creating team...");
    const res = await createTeam({ ...formData, members });
    toastFullfilled(
      toastId,
      res,
      "Team created successfully",
      "Error creating team",
      setOpen
    );
  };

  const onDelete = async () => {
    const toastId = toast.info("Deleting team...", { duration: Infinity });
    const res = await deleteTeam(currentTeam?.id ?? "");

    if (res == FetchStatus.SUCCESS) {
      toast.dismiss(toastId);
      toast.success("Team deleted successfully!");
      window.location.reload();
    } else toast.error("Error deleting team!");
  };

  const onConfirm = async () => {
    const toastId = toast.info("Updating team...", { duration: Infinity });
    const res = await updateTeam(currentTeam?.id ?? "", {
      ...formData,
      members,
    });
    if (res == FetchStatus.SUCCESS) {
      toast.dismiss(toastId);
      toast.success("Team updated successfully!");
      setOpen(false);
    } else {
      toast.dismiss(toastId);
      toast.error("Error updating team!");
    }
  };

  const handleMemberToggle = (userId: string) => {
    setMembers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  return (
    <>
      <SheetTitle className="pt-4 pl-6 sticky top-0 bg-white border-b border-grey-300 pb-5 z-10">
        <Typography
          variant="display4"
          text={isCreate ? "Create new team" : "Manage Design team"}
        />
      </SheetTitle>
      <div className="px-6 h-full mt-8">
        <Form {...form}>
          <form className="h-full relative flex flex-col">
            <div className="flex items-center gap-5">
              <span className="flex flex-col gap-[6px]">
                <Typography
                  text="Icon"
                  variant="paragraph3"
                  className="text-grey/400 font-semibold"
                />
                <span
                  onClick={() => inputRef.current?.click()}
                  className="inline-block cursor-pointer p-[10px] rounded-[7px] border border-dashed border-grey/350 text-grey/350"
                >
                  {formData.logo ? (
                    <TeamLogo src={formData.logo} />
                  ) : (
                    <ImagePlus size={26} />
                  )}
                  <input
                    ref={inputRef}
                    type="file"
                    accept=".svg"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </span>
              </span>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <CustomFormItem label="Name">
                    <FormControl>
                      <Input {...field} placeholder="Enter team name" />
                    </FormControl>
                  </CustomFormItem>
                )}
              />
            </div>

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

            <div className="mt-5">
              <FormField
                control={form.control}
                name="approver"
                render={({ field }) => {
                  return (
                    <CustomFormItem label="Team leave approver">
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="px-[14px] py-[10px]">
                            <SelectValue
                              placeholder="Select a approver"
                              className="capitalize"
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {allUsers
                            ?.sort((a, b) => a.name.localeCompare(b.name))
                            .map((user) => {
                              return (
                                <SelectItem
                                  value={user.id}
                                  key={user.id}
                                  className="font-semibold text-grey/400 capitalize"
                                >
                                  {user.name}
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

            <hr className="w-screen h-1 mt-6 -ml-6" />

            <div className="mt-6">
              <FormField
                control={form.control}
                name="calendar"
                render={({ field }) => {
                  return (
                    <CustomFormItem label="Public holiday calendar">
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="px-[14px] py-[10px]">
                            <SelectValue
                              placeholder="Select a calendar"
                              className="capitalize"
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {calendar?.map((data) => {
                            const flag = data.country.split(" ")[0];
                            return (
                              <SelectItem
                                value={data.id}
                                key={data.id}
                                className="font-semibold text-grey/400 capitalize"
                              >
                                <span className="whitespace-nowrap flex gap-2 items-center">
                                  <span
                                    className={cn(`flag flag:${flag}`)}
                                    style={{ width: "32px", height: "20px" }}
                                  ></span>
                                  {data?.country?.split(" ")[1]}
                                </span>
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
            <div className="mt-5">
              <FormField
                control={form.control}
                name="workday"
                render={({ field }) => {
                  return (
                    <CustomFormItem label="Workday">
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="px-[14px] py-[10px]">
                            <SelectValue
                              placeholder="Select workday"
                              className="capitalize"
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {workDays?.map((user) => {
                            return (
                              <SelectItem
                                value={user.id}
                                key={user.id}
                                className="font-semibold text-grey/400 capitalize"
                              >
                                {user.name}
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

            <div className="flex-grow "></div>

            <div className="py-6 bg-white mt-11 flex gap-6 items-center sticky bottom-0 left-0">
              <hr className="absolute top-0 -left-6 min-h-1 border-grey-300 w-[500px]" />
              {isCreate ? (
                <>
                  <Button
                    className="py-3 px-[18px] w-full bg-secondary-white text-gray-700 border border-grey-300 hover:bg-secondary-100/80"
                    type="button"
                    onClick={() => {
                      setOpen(false);
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
                    dialogHeadDesc={`Please confirm your decision to delete the ${
                      team?.name ?? ""
                    } team? This action will affect all team members associated with it, and it cannot be undone. `}
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
                      Delete Team
                    </Button>
                  </CustomDialog>
                  <Button
                    className="py-3 px-[18px] w-full bg-secondary-400-main text-main-400 border-secondary-400-main hover:bg-secondary-300"
                    type="button"
                    onClick={onConfirm}
                  >
                    Confirm
                  </Button>
                </>
              )}
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};

export default CreateManageTeam;
