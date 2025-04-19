import React from "react";

interface EngineeringIconProps {
  stroke?: string; // Allows customizing the stroke color
  width?: number;  // Allows customizing the width
  height?: number; // Allows customizing the height
}

const EngineeringIcon: React.FC<EngineeringIconProps> = ({
  stroke = "#667085", // Default stroke color is white
  width = 24,       // Default width is 24
  height = 24,  // Default stroke color
}) => {
  
  return (
    <svg
    width={width}
    height={height}
      viewBox="0 0 18 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke={stroke}
      strokeWidth="1.66667"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path
        d="M4.83333 11L7.33333 8.5L4.83333 6M9.83333 11H13.1667M5.5 16H12.5C13.9001 16 14.6002 16 15.135 15.7275C15.6054 15.4878 15.9878 15.1054 16.2275 14.635C16.5 14.1002 16.5 13.4001 16.5 12V5C16.5 3.59987 16.5 2.8998 16.2275 2.36502C15.9878 1.89462 15.6054 1.51217 15.135 1.27248C14.6002 1 13.9001 1 12.5 1H5.5C4.09987 1 3.3998 1 2.86502 1.27248C2.39462 1.51217 2.01217 1.89462 1.77248 2.36502C1.5 2.8998 1.5 3.59987 1.5 5V12C1.5 13.4001 1.5 14.1002 1.77248 14.635C2.01217 15.1054 2.39462 15.4878 2.86502 15.7275C3.3998 16 4.09987 16 5.5 16Z"
       
      />
    </svg>
  );
};

export default EngineeringIcon;