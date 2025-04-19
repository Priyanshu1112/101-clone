/* eslint-disable @typescript-eslint/no-unused-vars */
export const formatToSlackEmoji = (name: string) => {
  const parts = name.split(" ");
  const emojiCode = parts.shift(); // First part should be the emoji code (e.g., "1f622")

  // Convert the emoji code to a Unicode character
  let slackEmoji = "";
  if (emojiCode) {
    try {
      slackEmoji = String.fromCodePoint(parseInt(emojiCode, 16)); // Convert hex to Unicode
    } catch (error) {
      console.error("Invalid emoji code:", emojiCode);
    }
  }

  // Format the remaining name for Slack
  const formattedName = parts.join(" ");

  return `${slackEmoji} *${formattedName}*`;
};
