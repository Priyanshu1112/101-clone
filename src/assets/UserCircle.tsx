import React from "react";

export const UserBg = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
    >
      <circle cx="18" cy="18" r="18" fill={"white"} />
    </svg>
  );
};

export const UserCircleBg = ({
  size = 36,
  code,
}: {
  size?: number;
  code: { bg: string; text: string };
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
    >
      {/* <circle cx="18" cy="18" r="18" fill={'black'} /> */}
      <circle cx="18" cy="18" r="18" fill={code.bg} />
      <path
        d="M3.5 23.3333C6.22509 20.443 9.92485 18.6667 14 18.6667C18.0751 18.6667 21.7749 20.443 24.5 23.3333M19.25 8.75C19.25 11.6495 16.8995 14 14 14C11.1005 14 8.75 11.6495 8.75 8.75C8.75 5.85051 11.1005 3.5 14 3.5C16.8995 3.5 19.25 5.85051 19.25 8.75Z"
        // stroke={'white'}
        stroke={code.text}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="translate(4,6)" // Adjust for centering
      />
    </svg>
  );
};

export const UserCircleRectBg = () => {
  return (
    <div
      style={{
        padding: "8px 2px 0px 2px",
        borderRadius: "11px",
        backgroundColor: "#D6F4FF",
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="44"
        height="44"
        viewBox="0 0 44 44"
        fill="none"
      >
        <path
          d="M5.5 36.6667C9.78228 32.1247 15.5962 29.3333 22 29.3333C28.4038 29.3333 34.2177 32.1247 38.5 36.6667M30.25 13.75C30.25 18.3063 26.5563 22 22 22C17.4437 22 13.75 18.3063 13.75 13.75C13.75 9.19365 17.4437 5.5 22 5.5C26.5563 5.5 30.25 9.19365 30.25 13.75Z"
          stroke="#0ABEFF"
          strokeWidth="5.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

const UserCircle = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="25"
      height="24"
      viewBox="0 0 25 24"
      fill="none"
    >
      <path
        d="M6.20954 19.4384C6.81787 18.0052 8.23817 17 9.89325 17H15.8932C17.5483 17 18.9686 18.0052 19.577 19.4384M16.8932 9.5C16.8932 11.7091 15.1024 13.5 12.8932 13.5C10.6841 13.5 8.89325 11.7091 8.89325 9.5C8.89325 7.29086 10.6841 5.5 12.8932 5.5C15.1024 5.5 16.8932 7.29086 16.8932 9.5ZM22.8932 12C22.8932 17.5228 18.4161 22 12.8932 22C7.3704 22 2.89325 17.5228 2.89325 12C2.89325 6.47715 7.3704 2 12.8932 2C18.4161 2 22.8932 6.47715 22.8932 12Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default UserCircle;
