import { NextRequest, NextResponse } from "next/server";
import { RequestLeave } from "./utils/leave/Request";
import { ApplyLeave } from "./utils/leave/Apply";
import { ApproveLeave } from "./utils/leave/Approve";
import { RejectLeave } from "./utils/leave/Reject";
import { LeaveBalance } from "./utils/leave/LeaveBalance";
import { submitUpdate } from "./utils/update/Submit";
import { UpcomingHoliday } from "./utils/holiday/upcomingHoliday";
import slackClient from "@/service/slack";
import { Block, KnownBlock, SectionBlock } from "@slack/web-api";
import dayjs from "dayjs";
import { getDeducted } from "@/utils/helpers/getDeductes";

// Utility function to parse request body
async function parseRequestBody(request: NextRequest) {
  const body = await request.text();
  const params = new URLSearchParams(body);
  return JSON.parse(params.get("payload") || "{}");
}

// Background task handler
// async function processInBackground(fn: () => Promise<void>) {
//   try {
//     await fn().catch(console.error);
//   } catch (error) {
//     console.error("Background task failed:", error);
//   }
// }

function processInBackground(fn: () => Promise<void>) {
  // Don't await the Promise, truly let it run in background
  // after the response has been sent
  setImmediate(() => {
    fn().catch((error) => {
      console.error("Background task failed:", error);
    });
  });
}

const quickResponse = async () =>
  NextResponse.json({ response_action: "clear" });

export async function POST(request: NextRequest) {
  try {
    const payload = await parseRequestBody(request);
    const {
      user: slackUser,
      actions,
      channel,
      container,
      trigger_id,
      view,
      message,
    } = payload;
    const actionId = actions?.[0]?.action_id || view?.callback_id;
    const leaveId = actions?.[0]?.value;

    // Immediately acknowledge receipt for Slack

    switch (actionId) {
      case "leave_request":
        // Process in background and respond quickly

        await processInBackground(
          async () => await RequestLeave(channel.id, slackUser.id, trigger_id)
        );
        return quickResponse();

      case "apply_leave": {
        if (!payload || typeof payload !== "object") {
          return NextResponse.json({
            success: false,
            error: "Invalid payload",
          });
        }

        // const res = await quickResponse();

        const { state } = view;

        // Quick validation of required fields

        const [leaveType, leaveBalanceAndName] =
          state.values.leave_type?.leave_type_selection?.selected_option?.value.split(
            "--balance--"
          );

        const [leaveBalance, leaveName] = leaveBalanceAndName.split("--name--");

        const startDateStr =
          state.values.start_group?.start_date_selection?.selected_date;
        const startTime =
          state.values.start_time?.start_time_selection?.selected_option?.value;
        const endDateStr =
          state.values.end_group?.end_date_selection?.selected_date;
        const endTime =
          state.values.end_time?.end_time_selection?.selected_option?.value;
        const reason = state.values.reason?.reason_input?.value || null;

        const deducted = getDeducted(
          startDateStr,
          endDateStr,
          startTime,
          endTime,
          dayjs(endDateStr).isValid()
        );

        const exceedsBalance =
          leaveBalance && !Number.isNaN(leaveBalance)
            ? deducted > Number(leaveBalance)
            : true;

        if (
          !leaveType ||
          !startDateStr ||
          !startTime ||
          (endDateStr
            ? !dayjs(endDateStr, "YYYY-MM-DD").isAfter(
                dayjs(startDateStr, "YYYY-MM-DD")
              )
            : false) ||
          exceedsBalance
        ) {
          const error_msg =
            Number(leaveBalance) == 0
              ? `Oops, you have 0 ${leaveName
                  .split(" ")
                  .slice(1)
                  .join(" ")}. Kindly contact your approver.`
              : !startDateStr
              ? "Start date is required!"
              : !startTime
              ? "Start time is required"
              : endDateStr &&
                !dayjs(endDateStr, "YYYY-MM-DD").isAfter(
                  dayjs(startDateStr, "YYYY-MM-DD")
                )
              ? "End time must be > Start time!"
              : exceedsBalance
              ? `Balance : ${leaveBalance} day(s) | Applied for : ${deducted} day(s)`
              : "";

          const errorBlockId = "error_block";

          const updatedBlocks = view.blocks.filter(
            (block) => block.block_id !== errorBlockId
          );

          // 2) If there's an error message, push a new error block
          if (error_msg) {
            updatedBlocks.push({
              type: "section",
              block_id: errorBlockId, // So we can remove it next time
              text: {
                type: "mrkdwn",
                text: `:warning: ${error_msg}`,
              },
            });
          }

          await slackClient.views.update({
            view_id: view.id,
            view: {
              callback_id: "apply_leave",
              external_id: view.external_id,
              type: "modal",
              title: {
                type: "plain_text",
                text: "Apply for Leave",
              },
              submit: {
                type: "plain_text",
                text: "Submit",
              },
              close: {
                type: "plain_text",
                text: "Cancel",
              },
              blocks: [...updatedBlocks],
            },
          });

          return NextResponse.json({
            text: "Missing required fields",
          });
        }

        // await slackClient.views.update({
        //   view_id: view.id,
        //   view: {
        //     callback_id: "apply_leave",
        //     type: "modal",
        //     title: {
        //       type: "plain_text",
        //       text: "Processing...",
        //     },
        //     blocks: [
        //       {
        //         type: "section",
        //         text: {
        //           type: "mrkdwn",
        //           text: ":hourglass_flowing_sand: *Processing your leave application...*\nPlease wait while we process your request.",
        //         },
        //       },
        //     ],
        //     close: {
        //       type: "plain_text",
        //       text: "Close",
        //     },
        //   },
        // });

        const res = NextResponse.json({
          response_action: "update",
          view: {
            type: "modal",
            callback_id: "apply_leave",
            title: {
              type: "plain_text",
              text: "Processing...",
            },
            blocks: [
              {
                type: "section",
                text: {
                  type: "mrkdwn",
                  text: ":hourglass_flowing_sand: *Processing your leave application...*\nPlease wait while we process your request.",
                },
              },
            ],
            close: {
              type: "plain_text",
              text: "Cancel",
            },
          },
        });

        // Process the leave application in background
        await processInBackground(
          async () =>
            await ApplyLeave(
              view,
              payload.user,
              leaveType,
              new Date(startDateStr),
              startTime,
              endDateStr ? new Date(endDateStr) : null,
              endTime,
              reason
            )
        );

        return res;
      }

      case "approve_leave":
        if (container && container.message_ts)
          await processInBackground(
            async () =>
              await ApproveLeave(
                leaveId,
                container.message_ts,
                container.channel_id,
                slackUser.id,
                message
              )
          );
        return quickResponse();

      case "reject_leave":
        await processInBackground(
          async () =>
            await RejectLeave(
              leaveId,
              container.message_ts,
              container.channel_id,
              slackUser.id,
              message
            )
        );
        return quickResponse();

      case "leave_balance":
        await processInBackground(
          async () => await LeaveBalance(container.channel_id, slackUser.id)
        );
        return quickResponse();

      case "view_holidays":
        await processInBackground(
          async () => await UpcomingHoliday(container.channel_id, slackUser.id)
        );

        return quickResponse();

      default:
        if (actionId?.includes("update_response")) {
          const [responseId, question] = actionId.split("|").slice(1);

          const answer =
            payload.state.values.user_response?.response_input?.value || null;

          if (!answer) {
            try {
              // Fetch the existing message
              const existingMessage = await slackClient.conversations.history({
                channel: container.channel_id,
                latest: container.message_ts,
                inclusive: true,
                limit: 1,
              });

              // Get the blocks from the message and explicitly type them
              const currentBlocks = existingMessage.messages?.[0]?.blocks || [];

              // Create a properly typed array of blocks
              const messageBlocks: (Block | KnownBlock)[] = JSON.parse(
                JSON.stringify(currentBlocks)
              );

              // Define the error block with proper typing
              const errorBlock: SectionBlock = {
                type: "section",
                text: {
                  type: "mrkdwn",
                  text: "⚠️ *Answer is required to submit.*",
                },
              };

              // Check for existing error message
              const hasError = messageBlocks.some(
                (block) =>
                  block.type === "section" &&
                  "text" in block &&
                  block.text?.type === "mrkdwn" &&
                  block.text.text.includes("⚠️ *Answer is required to submit.*")
              );

              // Only add error if it doesn't exist
              if (!hasError) {
                messageBlocks.push(errorBlock);
              }

              // Update the message with proper typing
              await slackClient.chat.update({
                channel: container.channel_id,
                ts: container.message_ts,
                blocks: messageBlocks as (Block | KnownBlock)[],
              });

              return NextResponse.json({ text: "Answer is required" });
            } catch (error) {
              console.error("Slack update error:", error);
              return NextResponse.json(
                { text: "Failed to update message" },
                { status: 500 }
              );
            }
          }

          await processInBackground(
            async () =>
              await submitUpdate(
                responseId,
                question,
                answer,
                container.message_ts,
                container.channel_id
              )
          );
          return quickResponse();
        }

        return NextResponse.json({ text: "Unknown action" });
    }
  } catch (error) {
    console.error("Slack interactive error:", error);
    return NextResponse.json(
      { text: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}