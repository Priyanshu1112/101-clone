import React from "react";

const OperationsIcon = ({
  size = 20, // Default size (width)
  color = "#667085", // Default stroke color
}: {
  size?: number; // Width of the icon
  color?: string; // Stroke color
}) => {
  const height = (size * 19) / 20; // Maintain aspect ratio of the original design
  return (
    <svg
      width={size}
      height={height}
      viewBox="0 0 20 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.0003 1.16663L13.0003 4.16663C15.0003 -1.08337 20.5837 4.49996 15.3337 6.49996L18.3337 9.49996L15.3337 12.5C13.3337 7.24996 7.75033 12.8333 13.0003 14.8333L10.0003 17.8333L7.00033 14.8333C5.00033 20.0833 -0.583008 14.5 4.66699 12.5L1.66699 9.49996L4.66699 6.49996C6.66699 11.75 12.2503 6.16663 7.00033 4.16663L10.0003 1.16663Z"
        stroke={color}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default OperationsIcon;