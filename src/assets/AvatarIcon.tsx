import React from "react";

const AvatarIcon = ({
  size = 56, // Default size for width and height
  color = "#0ABEFF", // Default stroke color
}: {
  size?: number; // Size of the icon
  color?: string; // Stroke color of the icon
}) => {
  return (
    <svg
      width={size}
      height={(size * 53) / 56} // Maintain the original aspect ratio
      viewBox="0 0 56 53"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 50.2222C9.4883 43.3405 18.2973 39.1111 28 39.1111C37.7027 39.1111 46.5117 43.3405 53 50.2222M40.5 15.5C40.5 22.4036 34.9036 28 28 28C21.0964 28 15.5 22.4036 15.5 15.5C15.5 8.59644 21.0964 3 28 3C34.9036 3 40.5 8.59644 40.5 15.5Z"
        stroke={color}
        strokeWidth="5.55556"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default AvatarIcon;