import React from "react";

interface UserCircleIconProps {
  stroke?: string; // Allows customizing the stroke color
  width?: number;  // Allows customizing the width
  height?: number; // Allows customizing the height
}

const UserCircleIcon: React.FC<UserCircleIconProps> = ({
  stroke = "#F55F14", // Default stroke color
  width = 30,        // Default width
  height = 28,       // Default height
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 30 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.96484 23.3333C6.85884 20.443 10.7879 18.6667 15.1157 18.6667C19.4434 18.6667 23.3725 20.443 26.2665 23.3333M20.6911 8.75C20.6911 11.6495 18.1949 14 15.1157 14C12.0365 14 9.54026 11.6495 9.54026 8.75C9.54026 5.85051 12.0365 3.5 15.1157 3.5C18.1949 3.5 20.6911 5.85051 20.6911 8.75Z"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default UserCircleIcon;