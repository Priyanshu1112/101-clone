"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SheetTitle } from "@/components/ui/sheet";
import Typography from "@/app/(dashboard)/_components/Typography";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dispatch, SetStateAction, useState } from "react";
import EmojiPicker, { Emoji, EmojiClickData } from "emoji-picker-react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import dayjs from "dayjs";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import useLeaveStore, { FetchStatus } from "@/store/leave";
import useUserStore from "@/store/user";
import { LeaveType } from "@prisma/client";
import CustomDialog from "@/app/(dashboard)/_components/CustomDialog";
import { renderStringWithEmoji } from "./LeavePolicyTable";
import CustomFormItem from "../../_components/CustomFormItem";
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
  toastUpdatingError,
  toastUpdatingSuccess,
} from "@/utils/constant/toastMessage";

export enum FormType {
  Deductible,
  Non_Deductible,
  Edit,
}

const getFormSchema = (type: LeaveType) =>
  z.object({
    emoji: z.string(),
    name: z.string().min(2, {
      message: "Leave name must be at least 2 characters.",
    }),
    description: z.string({ message: "Description is required!" }),
    addedOn: z.string(),
    allowanceType:
      type == LeaveType.Deductible
        ? z.enum(["Monthly", "Yearly"])
        : z.enum(["Monthly", "Yearly"]).optional(),
    allowance:
      type == LeaveType.Deductible
        ? z.string({ message: "Number is required!" })
        : z.string().optional(),
    unlimited: z.boolean().optional(),
    needsApproval: z.boolean().optional(),
    notifyAdmin: z.boolean().optional(),
    carryForward: z.boolean().optional(),
  });

const AddEditLeave = ({
  type,
  setOpen,
}: {
  type: FormType;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const { addLeave, leaveDetail, fetchDetail, updateLeave, deleteLeave } =
    useLeaveStore();
  const { company } = useUserStore();

  const [emojiPicker, setEmojiPicker] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [isDeductible, isNonDeductible] = [
    type == FormType.Deductible,
    type == FormType.Non_Deductible,
  ];

  const formType = isDeductible
    ? LeaveType.Deductible
    : isNonDeductible
    ? LeaveType.Non_Deductible
    : leaveDetail?.type;

  const formSchema = getFormSchema(formType!);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues:
      type === FormType.Edit
        ? {
            emoji: leaveDetail?.name.split(" ")[0] || "1f60a",
            name: leaveDetail?.name.split(" ").slice(1).join(" ") || "",
            description: leaveDetail?.description || "",
            allowance: leaveDetail?.allowance + "" || "",
            allowanceType: leaveDetail?.allowanceType || undefined,
            unlimited: leaveDetail?.unlimited || false,
            needsApproval: leaveDetail?.needsApproval || false,
            notifyAdmin: leaveDetail?.notifyAdmin || false,
            carryForward: leaveDetail?.carryForward || false,
            addedOn: leaveDetail?.addedOn || dayjs().format("DD MMM YYYY"),
          }
        : {
            emoji: "1f60a",
            name: "",
            allowance: "",
            addedOn: dayjs().format("DD MMM YYYY"),
          },
  });

  const formData = form.watch();

  const validate = () => {
    const validation = formSchema.safeParse(formData);
    return validation.success;
  };

  async function onSubmit() {
    console.log("Form submitted with values:", formData);

    if (!validate) {
      toast.error("Invalid form!");
      return;
    }

    const toastId = toastPending(toastAdding("Leave"));

    const res = await addLeave(
      company?.id ?? "",
      formData.emoji + " " + formData.name,
      formData.description,
      formData.needsApproval,
      formData.notifyAdmin,
      formData.carryForward,
      formData.unlimited,
      formData.addedOn,
      formType!,
      formData.allowanceType,
      formData.allowance
    );

    toastFullfilled(
      toastId,
      res,
      toastAddingSuccess("Leave"),
      toastAddingError("Leave"),
      setOpen
    );
  }

  async function onConfirm() {
    if (!validate) {
      toast.error("Invalid form!");
      return;
    }

    const toastId = toastPending(toastUpdating("Leave"));
    const res = await updateLeave(
      leaveDetail?.id || "",
      formData.emoji + " " + formData.name,
      formData.description,
      formData.needsApproval,
      formData.notifyAdmin,
      formData.carryForward,
      formData.unlimited,
      formData.addedOn,
      formType!,
      formData.allowanceType,
      formData.allowance
    );
    toastFullfilled(
      toastId,
      res,
      toastUpdatingSuccess("Leave"),
      toastUpdatingError("Leave"),
      setOpen
    );
  }

  async function onDelete() {
    const toastId = toastPending(toastDeleting("Leave"));
    const res = await deleteLeave(leaveDetail?.id ?? "");

    toastFullfilled(
      toastId,
      res,
      toastDeletingSuccess("Leave"),
      toastDeletingError("Leave"),
      setOpen
    );

    // setOpen(false);
    // if (deleteLeaveStatus == FetchStatus.SUCCESS) {
    //   toast.success("Deleted Successfully!");
    // } else if (deleteLeaveStatus == FetchStatus.ERROR)
    //   toast.success("Error deleting leave!");
  }

  // useEffect(() => {
  //   if (addLeaveStatus === FetchStatus.PENDING) {
  //     toastId.current = toast("Adding Leave...", { duration: Infinity });
  //   } else if (addLeaveStatus === FetchStatus.SUCCESS) {
  //     toast.success("Leave added successfully!");
  //     setOpen(false);
  //     resetFetch();
  //   } else if (addLeaveStatus === FetchStatus.ERROR) {
  //     toast.error("Error adding leave!");
  //   }

  //   if (fetchDetail === FetchStatus.ERROR) {
  //     toast.error("Error loading details...");
  //   }

  //   return () => {
  //     if (toastId.current) {
  //       toast.dismiss(toastId.current);
  //       toastId.current = null;
  //       resetFetch();
  //     }
  //   };
  // }, [addLeaveStatus, fetchDetail, setOpen, resetFetch]);

  // useEffect(() => {
  //   if (toastId.current) {
  //     toast.dismiss(toastId.current);
  //     toastId.current = null;
  //   }

  //   if (updateLeaveStatus === FetchStatus.PENDING) {
  //     toastId.current = toast("Updating Leave...");
  //   } else if (updateLeaveStatus === FetchStatus.SUCCESS) {
  //     toast.success("Leave updated successfully!");
  //     setOpen(false);
  //     resetFetch();
  //   } else if (updateLeaveStatus === FetchStatus.ERROR) {
  //     toast.error("Error updating leave!");
  //   } else {
  //     if (toastId.current) toast.dismiss(toastId.current);
  //     toastId.current = null;
  //   }

  //   return () => {
  //     if (toastId.current) {
  //       toast.dismiss(toastId.current);
  //       toastId.current = null;
  //       resetFetch();
  //     }
  //   };
  // }, [updateLeaveStatus, resetFetch, setOpen]);

  return (
    <>
      <SheetTitle className="pt-4 pl-6 sticky top-0 bg-white border-b border-grey-300 pb-5">
        <Typography
          variant="display4"
          text={
            isDeductible
              ? "Add deductible leave type"
              : isNonDeductible
              ? "Add non-deductible leave type"
              : "Edit leave"
          }
        />
      </SheetTitle>

      {type == FormType.Edit && fetchDetail == FetchStatus.PENDING ? (
        <Typography text="Loading..." className="pt-3 px-6" />
      ) : (
        <div className="pt-3 px-6">
          <Typography
            text="Details"
            className="text-grey/500 font-semibold border-b pb-2 border-grey-300"
            variant="paragraph1"
          />
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mt-6 h-full"
            >
              {/* EMOJI and NAME */}
              <div className="flex gap-5 items-start">
                <FormField
                  control={form.control}
                  name="emoji"
                  render={() => (
                    <CustomFormItem label="Emoji" className="w-fit">
                      <FormControl>
                        <DropdownMenu
                          open={emojiPicker}
                          onOpenChange={(value) => setEmojiPicker(value)}
                        >
                          <DropdownMenuTrigger className="p-3 flex gap-2 items-center rounded-[6px] cursor-pointer border border-grey-300 shadow-sm">
                            <Emoji unified={formData.emoji} size={16} />
                            <span>
                              <ChevronDown size={16} color="#979FAF" />
                            </span>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start" className="p-0">
                            <EmojiPicker
                              onEmojiClick={(emoji: EmojiClickData) => {
                                form.setValue("emoji", emoji.unified);
                                setEmojiPicker(false);
                              }}
                            />
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </FormControl>
                      <FormMessage />
                    </CustomFormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <CustomFormItem label="Name">
                      <FormControl>
                        <Input
                          placeholder="Enter Leave Name"
                          {...field}
                          className=""
                        />
                      </FormControl>
                      <FormMessage />
                    </CustomFormItem>
                  )}
                />
              </div>
              {/* DESCRIPTION    */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => {
                  return (
                    <CustomFormItem label="Description" className="mt-5">
                      <FormControl>
                        <Textarea
                          className="focus-visible:ring-0 focus-visible:ring-offset-0 px-[14px] py-[10px] min-h-20"
                          placeholder="Write something here"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </CustomFormItem>
                  );
                }}
              />
              {/* ADDED ON    */}
              <FormField
                control={form.control}
                name="addedOn"
                render={({ field }) => {
                  return (
                    <CustomFormItem
                      label="Leave type added on"
                      className="mt-5"
                    >
                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                " justify-start text-left font-normal",
                                "text-muted-foreground "
                              )}
                            >
                              {field.value ? (
                                field.value
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={
                                field.value ? new Date(field.value) : undefined
                              }
                              onSelect={(date) => {
                                const addedOn =
                                  dayjs(date).format("DD MMM YYYY");
                                const isSmaller = dayjs(date).isBefore(
                                  dayjs(),
                                  "day"
                                );

                                if (isSmaller) {
                                  toast.error("Invalid date!");
                                  return;
                                }

                                field.onChange(addedOn);
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      <FormMessage />
                    </CustomFormItem>
                  );
                }}
              />

              {/* NUMBER OF LEAVES */}
              {!(formType == LeaveType.Non_Deductible) && (
                <>
                  <div className="flex items-center mt-16 border-b border-grey-300 justify-between">
                    <Typography
                      text="Number of leaves"
                      className="text-grey/500 font-semibold"
                      variant="paragraph1"
                    />

                    <FormField
                      control={form.control}
                      name="unlimited"
                      render={({ field }) => {
                        return (
                          <FormItem className="flex gap-2 items-center ">
                            <FormControl className="">
                              <Checkbox
                                className="border-grey-300"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="flex items-center pb-2">
                              <Typography
                                variant="paragraph2"
                                text="Unlimited leaves"
                                className="text-grey/400"
                              />
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  </div>

                  {/* ALLOWANCE TYPE AND NUMBER */}
                  <div className="mt-[22px] flex items-center">
                    <FormField
                      control={form.control}
                      name="allowanceType"
                      render={({ field }) => {
                        return (
                          <FormItem className="w-full">
                            <FormControl className="w-full">
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex gap-6 items-center w-full"
                              >
                                <FormItem className="flex-1 flex gap-2 items-center">
                                  <FormControl>
                                    <RadioGroupItem
                                      value="Yearly"
                                      className="border-grey-300"
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal pb-2">
                                    <Typography
                                      text="Yearly"
                                      className="text-grey/400"
                                    />
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex-1 flex gap-2 items-center">
                                  <FormControl>
                                    <RadioGroupItem
                                      value="Monthly"
                                      className="border-grey-300"
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal pb-2">
                                    <Typography
                                      text="Monthly"
                                      className="text-grey/400"
                                    />
                                  </FormLabel>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="allowance"
                    render={({ field }) => {
                      return (
                        <CustomFormItem
                          label="Select number of leaves"
                          className="mt-[14px]"
                        >
                          <FormControl>
                            <Input
                              placeholder="Enter Number"
                              {...field}
                              type="number"
                            />
                          </FormControl>
                          <FormMessage />
                        </CustomFormItem>
                      );
                    }}
                  />
                </>
              )}

              {/* OTHER SETTINGS */}
              <Typography
                text="Other settings"
                className="text-grey/500 font-semibold border-b pb-2 border-grey-300 mt-16"
                variant="paragraph1"
              />
              <div className="mt-5 flex flex-col">
                {!(formType == LeaveType.Non_Deductible) && (
                  <FormField
                    control={form.control}
                    name="carryForward"
                    render={({ field }) => {
                      return (
                        <FormItem className="flex gap-2 items-center ">
                          <FormControl className="">
                            <Checkbox
                              className="border-grey-300"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="flex items-center pb-2">
                            <Typography
                              variant="paragraph2"
                              text="Carry forward leave"
                              className="text-grey/400"
                            />
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                )}
                <FormField
                  control={form.control}
                  name="needsApproval"
                  render={({ field }) => {
                    return (
                      <FormItem className="flex gap-2 items-center ">
                        <FormControl className="">
                          <Checkbox
                            className="border-grey-300"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="flex items-center pb-2">
                          <Typography
                            variant="paragraph2"
                            text="Needs approval"
                            className="text-grey/400"
                          />
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="notifyAdmin"
                  render={({ field }) => {
                    return (
                      <FormItem className="flex gap-2 items-center ">
                        <FormControl className="">
                          <Checkbox
                            className="border-grey-300"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="flex items-center pb-2">
                          <Typography
                            variant="paragraph2"
                            text="Notify Admin"
                            className="text-grey/400"
                          />
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              </div>

              <div className="py-6 bg-white mt-11 flex gap-6 items-center sticky bottom-0 left-0">
                <hr className="absolute top-0 -left-6 min-h-1 border-grey-300 w-[500px]" />
                {type == FormType.Edit ? (
                  <>
                    <CustomDialog
                      open={deleteOpen}
                      setOpen={setDeleteOpen}
                      dialogHeadDesc={`You're about to delete ${renderStringWithEmoji(
                        formData.emoji + " " + formData.name
                      )}. This could change your leave policy. Remember, this action can't be undone.`}
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
                        Delete
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
                ) : (
                  <Button
                    onClick={onSubmit}
                    className="py-3 px-[18px] w-full bg-secondary-400-main text-main-400 border-secondary-400-main hover:bg-secondary-300"
                    type="button"
                  >
                    Add
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </div>
      )}
    </>
  );
};

export default AddEditLeave;
