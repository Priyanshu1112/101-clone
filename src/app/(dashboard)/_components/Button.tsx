import Typography from "./Typography";
import React from "react";

interface ButtonProps {
  text: string;
  icon?: React.ElementType; // Icon as a React component
  className?: string;
  textClass?: string;
  iconColor?: string;
  onClick?: () => void;
}

const Button = ({
  text,
  icon: Icon,
  className,
  textClass,
  iconColor,
  onClick,
}: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`${
        className ?? ""
      } py-[10px] px-[14px] rounded-[8px] border flex gap-[6px] items-center`}
      style={{ boxShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)" }}
    >
      <Typography
        variant="paragraph3"
        text={text}
        className={`${textClass ?? ""} font-semibold`}
      />
      {Icon && <Icon size={20} color={iconColor} />}{" "}
      {/* Render the icon if it exists */}
    </button>
  );
};

export default Button;
