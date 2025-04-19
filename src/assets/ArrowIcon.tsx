import React from "react";

type ArrowIconProps = {
  size?: number;
  color?: string;
};

export const LeftArrowIcon = ({
  size = 30,
  color = "#7E8475",
}: ArrowIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 30 30"
      fill="none"
    >
      <path
        d="M14.9998 9.66699L9.6665 15.0003M9.6665 15.0003L14.9998 20.3337M9.6665 15.0003H20.3332M28.3332 15.0003C28.3332 22.3641 22.3636 28.3337 14.9998 28.3337C7.63604 28.3337 1.6665 22.3641 1.6665 15.0003C1.6665 7.63653 7.63604 1.66699 14.9998 1.66699C22.3636 1.66699 28.3332 7.63653 28.3332 15.0003Z"
        stroke={color}
        strokeWidth="2.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const RightArrowIcon = ({
  size = 32,
  color = "#7E8475",
}: ArrowIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
    >
      <path
        d="M15.9998 21.3337L21.3332 16.0003M21.3332 16.0003L15.9998 10.667M21.3332 16.0003H10.6665M29.3332 16.0003C29.3332 23.3641 23.3636 29.3337 15.9998 29.3337C8.63604 29.3337 2.6665 23.3641 2.6665 16.0003C2.6665 8.63653 8.63604 2.66699 15.9998 2.66699C23.3636 2.66699 29.3332 8.63653 29.3332 16.0003Z"
        stroke={color}
        strokeWidth="2.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
