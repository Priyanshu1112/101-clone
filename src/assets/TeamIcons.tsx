import React from "react";

interface IconProps {
  stroke?: string;
  fill?: string;
  width?: number;
  height?: number;
}

export const MarketingTeamIcon: React.FC<IconProps> = ({
  stroke = "black",
  fill = "none",
  width = 24,
  height = 24,
}) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill={fill} xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 15L9 12M12 15C13.3968 14.4687 14.7369 13.7987 16 13M12 15V20C12 20 15.03 19.45 16 18C17.08 16.38 16 13 16 13M9 12C9.53214 10.6194 10.2022 9.29607 11 8.05C12.1652 6.18699 13.7876 4.65305 15.713 3.5941C17.6384 2.53514 19.8027 1.98637 22 2C22 4.72 21.22 9.5 16 13M9 12H4C4 12 4.55 8.97 6 8C7.62 6.92 11 8 11 8M4.5 16.5C3 17.76 2.5 21.5 2.5 21.5C2.5 21.5 6.24 21 7.5 19.5C8.21 18.66 8.2 17.37 7.41 16.59C7.02131 16.219 6.50929 16.0046 5.97223 15.988C5.43516 15.9714 4.91088 16.1537 4.5 16.5Z"
      stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    />
  </svg>
);

export const ZazzyTeamIcon: React.FC<IconProps> = ({
  stroke = "black",
  fill = "none",
  width = 22,
  height = 20,
}) => (
  <svg width={width} height={height} viewBox="0 0 22 20" fill={fill} xmlns="http://www.w3.org/2000/svg">
    <path
      d="M14.5 9.5H13.5L12 12.5L10 6.5L8.5 9.5H7.5M10.9932 3.13581C8.9938 0.7984 5.65975 0.169643 3.15469 2.31001C0.649644 4.45038 0.296968 8.02898 2.2642 10.5604C3.75009 12.4724 7.97129 16.311 9.94801 18.0749C10.3114 18.3991 10.4931 18.5613 10.7058 18.6251C10.8905 18.6805 11.0958 18.6805 11.2805 18.6251C11.4932 18.5613 11.6749 18.3991 12.0383 18.0749C14.015 16.311 18.2362 12.4724 19.7221 10.5604C21.6893 8.02898 21.3797 4.42787 18.8316 2.31001C16.2835 0.192157 12.9925 0.7984 10.9932 3.13581Z"
      stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    />
  </svg>
);

// Define other team icons similarly
export const OperationsTeamIcon: React.FC<IconProps> = ({ stroke = "black", width = 24, height = 24 }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 8V5L19 2L20 4L22 5L19 8H16ZM16 8L12 11.9999M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2M17 12C17 14.7614 14.7614 17 12 17C9.23858 17 7 14.7614 7 12C7 9.23858 9.23858 7 12 7" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const VisualTeamIcon: React.FC<IconProps> = ({ stroke = "black", width = 24, height = 24 }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 5.00001L16 19M10 4.00001L10 20M3 12H21" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const UIUXTeamIcon: React.FC<IconProps> = ({ stroke = "black", width = 24, height = 24 }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 1.5H8.5C6.567 1.5 5 3.067 5 5C5 6.933 6.567 8.5 8.5 8.5M12 1.5V8.5" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const ArchivedIcon: React.FC<IconProps> = ({ stroke = "black", width = 22, height = 20 }) => (
  <svg width={width} height={height} viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 6H19V14.2C19 15.8802 19 16.7202 18.673 17.362" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const TechTeamIcon: React.FC<IconProps> = ({ stroke = "black", width = 24, height = 24 }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 17L22 12L17 7M7 7L2 12L7 17M14 3L10 21" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const FinanceTeamIcon: React.FC<IconProps> = ({ stroke = "black", width = 24, height = 24 }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 3H18M6 8H18M14.5 21L6 13H9C15.667 13 15.667 3 9 3" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);


