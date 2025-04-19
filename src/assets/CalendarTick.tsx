import React from "react";

const CalendarTick = ({
  size = 20, // Default width
  color = "#667085", // Default stroke color
}: {
  size?: number; // Width of the icon
  color?: string; // Stroke color
}) => {
  const height = (size * 15) / 14; // Maintain aspect ratio of the original design
  return (
    <svg
      width={size}
      height={height}
      viewBox="0 0 14 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13 6.16671H1M9.66667 0.833374V3.50004M4.33333 0.833374V3.50004M5 10.1667L6.33333 11.5L9.33333 8.50004M4.2 14.1667H9.8C10.9201 14.1667 11.4802 14.1667 11.908 13.9487C12.2843 13.757 12.5903 13.451 12.782 13.0747C13 12.6469 13 12.0868 13 10.9667V5.36671C13 4.2466 13 3.68655 12.782 3.25873C12.5903 2.8824 12.2843 2.57644 11.908 2.38469C11.4802 2.16671 10.9201 2.16671 9.8 2.16671H4.2C3.0799 2.16671 2.51984 2.16671 2.09202 2.38469C1.71569 2.57644 1.40973 2.8824 1.21799 3.25873C1 3.68655 1 4.2466 1 5.36671V10.9667C1 12.0868 1 12.6469 1.21799 13.0747C1.40973 13.451 1.71569 13.757 2.09202 13.9487C2.51984 14.1667 3.0799 14.1667 4.2 14.1667Z"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default CalendarTick;
