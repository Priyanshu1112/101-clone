import React from "react";

interface MessagesIconProps {
  stroke?: string; // Allows customizing the stroke color
  fill?: string;   // Allows customizing the fill color
  width?: number;  // Allows customizing the width
  height?: number; // Allows customizing the height
}

const MessagesIcon: React.FC<MessagesIconProps> = ({
  fill = "none",      // Default fill color
  width = 49,         // Default width
  height = 49,        // Default height
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 49 49"
      fill={fill}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_b_716_10165)">
        <path
          d="M9.88428 23.0004C9.88428 19.8492 9.88428 18.2736 10.7594 17.1134C11.6346 15.9532 13.1496 15.5204 16.1795 14.6546L21.4971 13.1353C23.2738 12.6277 24.1621 12.3739 25.0739 12.3739C25.9856 12.3739 26.874 12.6277 28.6506 13.1353L33.9682 14.6546C36.9982 15.5204 38.5132 15.9532 39.3883 17.1134C40.2635 18.2736 40.2635 19.8492 40.2635 23.0004V27.303C40.2635 33.4405 40.2635 36.5093 38.3568 38.416C36.4501 40.3226 33.3813 40.3226 27.2438 40.3226H22.9039C16.7664 40.3226 13.6976 40.3226 11.791 38.416C9.88428 36.5093 9.88428 33.4405 9.88428 27.303V23.0004Z"
          fill="url(#paint0_linear_716_10165)"
        />
      </g>
      <g filter="url(#filter1_b_716_10165)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M15.3091 7.77356C13.5115 7.77356 12.0542 9.78453 12.0542 12.2652V22.0951C18.4288 26.9309 21.784 31.6188 25.0739 31.6428C28.4334 31.6673 31.7247 26.9265 38.0935 22.0951V12.2652C38.0935 9.78453 36.6362 7.77356 34.8386 7.77356H15.3091Z"
          fill="#B9DDFF"
          fillOpacity="0.6"
        />
        <path
          d="M12.154 12.2652C12.154 11.0436 12.513 9.94169 13.0883 9.14768C13.6638 8.35356 14.4502 7.87335 15.3091 7.87335H34.8386C35.6975 7.87335 36.4839 8.35356 37.0594 9.14768C37.6347 9.94169 37.9937 11.0436 37.9937 12.2652V22.0456C35.7141 23.7782 33.8266 25.5 32.1929 26.9903C31.5559 27.5714 30.9574 28.1173 30.3894 28.6149C29.371 29.507 28.4514 30.2432 27.5794 30.7547C26.7078 31.2659 25.8901 31.549 25.0746 31.543C24.2762 31.5372 23.4672 31.2484 22.5989 30.735C21.7302 30.2214 20.8088 29.487 19.7863 28.5981C19.2126 28.0993 18.6073 27.5521 17.9628 26.9694C16.3236 25.4874 14.4303 23.7755 12.154 22.0456V12.2652Z"
          stroke="url(#paint1_linear_716_10165)"
          strokeWidth="0.199587"
        />
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_716_10165"
          x1="18.6475"
          y1="18.2842"
          x2="41.5699"
          y2="26.7734"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#7FC0FB" />
          <stop offset="1" stopColor="#4088F4" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default MessagesIcon;