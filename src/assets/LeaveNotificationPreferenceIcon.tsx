import React from "react";

const LeaveNotificationPreferenceIcon = ({
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
        d="M6.33333 2.16667H4.2C3.0799 2.16667 2.51984 2.16667 2.09202 2.38465C1.71569 2.5764 1.40973 2.88236 1.21799 3.25869C1 3.68651 1 4.24656 1 5.36667V10.3C1 11.4201 1 11.9802 1.21799 12.408C1.40973 12.7843 1.71569 13.0903 2.09202 13.282C2.51984 13.5 3.07989 13.5 4.2 13.5H9.13333C10.2534 13.5 10.8135 13.5 11.2413 13.282C11.6176 13.0903 11.9236 12.7843 12.1153 12.408C12.3333 11.9802 12.3333 11.4201 12.3333 10.3V8.16667M7.66667 10.8333H3.66667M9 8.16667H3.66667M12.4142 2.08579C13.1953 2.86683 13.1953 4.13317 12.4142 4.91421C11.6332 5.69526 10.3668 5.69526 9.58579 4.91421C8.80474 4.13317 8.80474 2.86683 9.58579 2.08579C10.3668 1.30474 11.6332 1.30474 12.4142 2.08579Z"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default LeaveNotificationPreferenceIcon;
