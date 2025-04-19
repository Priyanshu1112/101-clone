import React from "react";

const WorkdayPreferences = ({
  size = 20, // Default width
  color = "#667085", // Default stroke color
}: {
  size?: number; // Width of the icon
  color?: string; // Stroke color
}) => {
  const height = size; // Maintain a square aspect ratio as the SVG is square (15x15)
  return (
    <svg
      width={size}
      height={height}
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14.1333 7.16667L12.8004 8.5L11.4666 7.16667M12.9634 8.16667C12.9876 7.94778 13 7.72534 13 7.5C13 4.18629 10.3137 1.5 7 1.5C3.68629 1.5 1 4.18629 1 7.5C1 10.8137 3.68629 13.5 7 13.5C8.88484 13.5 10.5667 12.6309 11.6667 11.2716M7 4.16667V7.5L9 8.83333"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default WorkdayPreferences;
