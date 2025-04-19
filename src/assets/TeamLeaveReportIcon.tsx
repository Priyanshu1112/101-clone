import React from "react";

const TeamLeaveReport = ({
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
        d="M5 4.16667H2.06667C1.6933 4.16667 1.50661 4.16667 1.36401 4.23933C1.23856 4.30324 1.13658 4.40523 1.07266 4.53067C1 4.67328 1 4.85997 1 5.23333V12.4333C1 12.8067 1 12.9934 1.07266 13.136C1.13658 13.2614 1.23856 13.3634 1.36401 13.4273C1.50661 13.5 1.6933 13.5 2.06667 13.5H5M5 13.5H9M5 13.5L5 2.56667C5 2.1933 5 2.00661 5.07266 1.86401C5.13658 1.73857 5.23857 1.63658 5.36401 1.57266C5.50661 1.5 5.6933 1.5 6.06667 1.5L7.93333 1.5C8.3067 1.5 8.49339 1.5 8.63599 1.57266C8.76144 1.63658 8.86342 1.73856 8.92734 1.86401C9 2.00661 9 2.1933 9 2.56667V13.5M9 6.83333H11.9333C12.3067 6.83333 12.4934 6.83333 12.636 6.906C12.7614 6.96991 12.8634 7.0719 12.9273 7.19734C13 7.33995 13 7.52663 13 7.9V12.4333C13 12.8067 13 12.9934 12.9273 13.136C12.8634 13.2614 12.7614 13.3634 12.636 13.4273C12.4934 13.5 12.3067 13.5 11.9333 13.5H9"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default TeamLeaveReport;
