import React from "react";

const TeamManagementIcon = ({
  size = 20, // Default width
  color = "#667085", // Default stroke color
}: {
  size?: number; // Width of the icon
  color?: string; // Stroke color
}) => {
  const height = (size * 15) / 16; // Maintain aspect ratio of the original design
  return (
    <svg
      width={size}
      height={height}
      viewBox="0 0 16 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.54412 12.459C3.94967 11.5035 4.89653 10.8334 5.99992 10.8334H9.99992C11.1033 10.8334 12.0502 11.5035 12.4557 12.459M10.6666 5.83337C10.6666 7.30613 9.47268 8.50004 7.99992 8.50004C6.52716 8.50004 5.33325 7.30613 5.33325 5.83337C5.33325 4.36061 6.52716 3.16671 7.99992 3.16671C9.47268 3.16671 10.6666 4.36061 10.6666 5.83337ZM14.6666 7.50004C14.6666 11.1819 11.6818 14.1667 7.99992 14.1667C4.31802 14.1667 1.33325 11.1819 1.33325 7.50004C1.33325 3.81814 4.31802 0.833374 7.99992 0.833374C11.6818 0.833374 14.6666 3.81814 14.6666 7.50004Z"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default TeamManagementIcon;
