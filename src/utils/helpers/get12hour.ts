export const get12hr = (time: string) => {
  const [hr, min] = time.split(":").map(Number);
  const period = hr >= 12 ? "PM" : "AM";
  const formattedHr = hr % 12 === 0 ? 12 : hr % 12; // Convert 0 to 12 for 12-hour format

  return `${formattedHr}:${min?.toString().padStart(2, "0")} ${period}`;
};
