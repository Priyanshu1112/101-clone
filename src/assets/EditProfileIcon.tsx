import React from "react";

const EditProfileIcon = ({
  size = 20, // Default width
  color = "#667085", // Default stroke color
}: {
  size?: number; // Width of the icon
  color?: string; // Stroke color
}) => {
  const height = (size * 17) / 16; // Maintain aspect ratio of the original design
  return (
    <svg
      width={size}
      height={height}
      viewBox="0 0 16 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2 13.8333C3.55719 12.1817 5.67134 11.1667 8 11.1667C10.3287 11.1667 12.4428 12.1817 14 13.8333M11 5.5C11 7.15685 9.65685 8.5 8 8.5C6.34315 8.5 5 7.15685 5 5.5C5 3.84315 6.34315 2.5 8 2.5C9.65685 2.5 11 3.84315 11 5.5Z"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default EditProfileIcon;
