import { WebClient } from "@slack/web-api";

// Create a single WebClient instance with the bot token
const slackClient = new WebClient(
  process.env.NODE_ENV === "production"
    ? process.env.SLACK_BOT_TOKEN_LM
    : process.env.SLACK_BOT_TOKEN_LM
  // : process.env.SLACK_BOT_TOKEN_LM
);

// Use this instance throughout your app
export default slackClient;

export const slackUserClient = new WebClient(
  process.env.NODE_ENV === "production"
    ? process.env.SLACK_USER_TOKEN_LM
    : process.env.SLACK_USER_TOKEN_LM
);
