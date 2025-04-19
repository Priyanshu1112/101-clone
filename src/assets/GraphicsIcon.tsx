import React from "react";

interface GraphicsIconProps {
  size?: number; // Allows customizing the width of the icon
  color?: string; // Allows customizing the stroke color
}

const GraphicsIcon: React.FC<GraphicsIconProps> = ({
  size = 19, // Default width
  color = "#667085", // Default stroke color
}) => {
  const height = (size * 18) / 19; // Maintains the original aspect ratio
  return (
    <svg
      width={size}
      height={height}
      viewBox="0 0 19 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.5 2.83329V1.16663M11.5 12.8333V11.1666M5.66667 6.99996H7.33333M15.6667 6.99996H17.3333M13.8333 9.33329L14.8333 10.3333M13.8333 4.66663L14.8333 3.66663M1.5 17L9 9.49996M9.16667 4.66663L8.16667 3.66663"
        stroke={color}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default GraphicsIcon;