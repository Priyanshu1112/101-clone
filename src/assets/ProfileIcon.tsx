import React from "react";

interface ProfileIconProps {
  stroke?: string; // Allows customizing the stroke color
  fill?: string;   // Allows customizing the fill color
  width?: number;  // Allows customizing the width
  height?: number; // Allows customizing the height
}

const ProfileIcon: React.FC<ProfileIconProps> = ({
  fill = "none",    // Default fill color
  width = 49,       // Default width
  height = 49,      // Default height
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 49 49"
      fill={fill}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.2828 24.3396C11.6078 22.6683 11.7703 21.8326 12.1581 21.1808C12.6751 20.3118 13.4783 19.6498 14.4301 19.3081C15.1438 19.0518 15.9952 19.0518 17.6978 19.0518L32.3387 19.0518C34.0414 19.0518 34.8927 19.0518 35.6065 19.3081C36.5582 19.6498 37.3614 20.3118 37.8785 21.1808C38.2663 21.8326 38.4288 22.6683 38.7538 24.3396C39.2142 26.7077 39.4445 27.8918 39.2043 28.8376C38.8841 30.0988 38.0169 31.1508 36.84 31.7059C35.9574 32.1222 34.7512 32.1222 32.3387 32.1222H17.6978C15.2854 32.1222 14.0792 32.1222 13.1965 31.7059C12.0197 31.1508 11.1525 30.0988 10.8323 28.8376C10.5921 27.8918 10.8223 26.7077 11.2828 24.3396Z"
        fill="url(#paint0_linear_716_10207)"
      />
      <g filter="url(#filter0_b_716_10207)">
        <circle
          cx="25.2054"
          cy="16.4232"
          r="8.25129"
          fill="#BFB5FF"
          fillOpacity="0.6"
        />
        <circle
          cx="25.2054"
          cy="16.4232"
          r="8.1515"
          stroke="url(#paint1_linear_716_10207)"
          strokeWidth="0.199587"
        />
      </g>
      <g filter="url(#filter1_b_716_10207)">
        <path
          d="M11.4795 35.322C11.4795 35.322 11.4795 35.322 11.4795 35.322C11.4795 39.0663 14.5148 42.1016 18.2591 42.1016C18.2591 42.1016 18.2591 42.1016 18.2591 42.1016L31.8182 42.1016C31.8183 42.1016 31.8182 42.1016 31.8182 42.1016C35.5625 42.1016 38.5978 39.0663 38.5978 35.322C38.5978 35.322 38.5978 35.322 38.5978 35.322C38.5978 35.322 38.5978 35.322 38.5978 35.322C38.5978 30.3297 34.5507 26.2826 29.5584 26.2826C29.5584 26.2826 29.5575 26.2826 29.5557 26.2826C26.3343 26.2826 23.743 26.2826 20.5216 26.2826C20.5198 26.2826 20.5189 26.2826 20.5189 26.2826C15.5266 26.2826 11.4795 30.3297 11.4795 35.322C11.4795 35.322 11.4795 35.322 11.4795 35.322Z"
          fill="#BFB5FF"
          fillOpacity="0.6"
        />
        <path
          d="M20.5189 26.3824C15.5817 26.3824 11.5793 30.3848 11.5793 35.322L18.3589 42.1016C18.3296 42.0311 18.2591 42.0018 18.2591 42.0018L18.3589 42.0018L31.7185 42.0018L31.8182 42.0018C35.5074 42.0018 38.498 39.0112 38.498 35.322C38.498 30.3848 34.4956 26.3824 29.5584 26.3824L29.5584 26.3824Z"
          stroke="url(#paint2_linear_716_10207)"
          strokeWidth="0.199587"
        />
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_716_10207"
          x1="18.5669"
          y1="21.911"
          x2="34.4854"
          y2="34.6841"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#917FFB" />
          <stop offset="1" stopColor="#3F2DAF" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_716_10207"
          x1="16.9541"
          y1="11.2662"
          x2="24.8831"
          y2="24.2885"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="0.99715" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_716_10207"
          x1="12.7509"
          y1="27.6891"
          x2="39.4909"
          y2="40.0479"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default ProfileIcon;