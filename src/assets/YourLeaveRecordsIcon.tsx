import React from "react";

const YourLeaveRecordsIcon = ({
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
        d="M12.3334 4.16671V4.03337C12.3334 2.91327 12.3334 2.35322 12.1154 1.92539C11.9237 1.54907 11.6177 1.24311 11.2414 1.05136C10.8136 0.833374 10.2535 0.833374 9.13341 0.833374H4.86675C3.74664 0.833374 3.18659 0.833374 2.75877 1.05136C2.38244 1.24311 2.07648 1.54907 1.88473 1.92539C1.66675 2.35322 1.66675 2.91327 1.66675 4.03337V10.9667C1.66675 12.0868 1.66675 12.6469 1.88473 13.0747C2.07648 13.451 2.38244 13.757 2.75877 13.9487C3.18659 14.1667 3.74664 14.1667 4.86675 14.1667H7.33341M7.33341 6.83337H4.33341M6.66675 9.50004H4.33341M9.66675 4.16671H4.33341M11.0001 11.5V7.83337C11.0001 7.28109 11.4478 6.83337 12.0001 6.83337C12.5524 6.83337 13.0001 7.28109 13.0001 7.83337V11.5C13.0001 12.6046 12.1047 13.5 11.0001 13.5C9.89551 13.5 9.00008 12.6046 9.00008 11.5V8.83337"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default YourLeaveRecordsIcon;
