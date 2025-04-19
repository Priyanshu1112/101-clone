import React from "react";

type DownloadIconProps = {
  size?: number;   // Treated as the width
  color?: string;  // Stroke color
};

const DownloadIcon = ({
  size = 16,        // Default width is 16
  color = "#7E8475",
}: DownloadIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={(size * 20) / 16} // Preserve 16:20 aspect ratio
      viewBox="0 0 16 20"
      fill="none"
    >
      <path
        d="M9.66683 1.8916V5.33372C9.66683 5.80043 9.66683 6.03378 9.75766 6.21204C9.83755 6.36885 9.96504 6.49633 10.1218 6.57622C10.3001 6.66705 10.5335 6.66705 11.0002 6.66705H14.4423M5.50016 12.5003L8.00016 15.0003M8.00016 15.0003L10.5002 12.5003M8.00016 15.0003L8.00016 10.0003M9.66683 1.66699H5.3335C3.93336 1.66699 3.2333 1.66699 2.69852 1.93948C2.22811 2.17916 1.84566 2.56161 1.60598 3.03202C1.3335 3.5668 1.3335 4.26686 1.3335 5.66699V14.3337C1.3335 15.7338 1.3335 16.4339 1.60598 16.9686C1.84566 17.439 2.22811 17.8215 2.69852 18.0612C3.2333 18.3337 3.93336 18.3337 5.3335 18.3337H10.6668C12.067 18.3337 12.767 18.3337 13.3018 18.0612C13.7722 17.8215 14.1547 17.439 14.3943 16.9686C14.6668 16.4339 14.6668 15.7338 14.6668 14.3337V6.66699L9.66683 1.66699Z"
        stroke={color}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default DownloadIcon;
