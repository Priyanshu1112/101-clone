/* eslint-disable @typescript-eslint/no-explicit-any */
import slackClient from "@/service/slack";
import { Channel } from "@slack/web-api/dist/types/response/ChannelsCreateResponse";

export async function getAllChannels() {
  let channels: Channel[] = [];
  let cursor: string | undefined;

  try {
    do {
      const response = await slackClient.conversations.list({
        types: "public_channel,private_channel",
        cursor,
        limit: 1000, // Max limit per API call
      });

      if (response.channels) {
        channels = channels.concat(response.channels);
      }

      cursor = response.response_metadata?.next_cursor;
    } while (cursor);

    channels = channels.map((channel) => ({
      id: channel.id,
      name: channel.name,
    }));

    return channels;
  } catch (error) {
    console.error("Error fetching channels:", error);
  }
}
