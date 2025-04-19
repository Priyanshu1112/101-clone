import React from "react";

const AllTeamIcon = ({
  size = 20, // Default size (width)
  color = "#2F1847", // Default stroke color
}: {
  size?: number; // Width of the icon
  color?: string; // Stroke color
}) => {
  const height = (size * 16) / 20; // Maintain aspect ratio of the original design
  return (
    <svg
      width={size}
      height={height}
      viewBox="0 0 20 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.3337 1.3898C14.5684 2.00343 15.417 3.27762 15.417 4.75C15.417 6.22238 14.5684 7.49657 13.3337 8.1102M15.0003 12.472C16.2599 13.0419 17.3941 13.9708 18.3337 15.1667M1.66699 15.1667C3.28907 13.1021 5.49131 11.8333 7.91699 11.8333C10.3427 11.8333 12.5449 13.1021 14.167 15.1667M11.667 4.75C11.667 6.82107 9.98806 8.5 7.91699 8.5C5.84592 8.5 4.16699 6.82107 4.16699 4.75C4.16699 2.67893 5.84592 1 7.91699 1C9.98806 1 11.667 2.67893 11.667 4.75Z"
        stroke={color}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default AllTeamIcon;