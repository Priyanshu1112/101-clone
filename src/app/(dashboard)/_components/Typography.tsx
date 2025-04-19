import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

type TypographyVariant =
  | "display1"
  | "display2"
  | "display3"
  | "display4"
  | "display4R"
  | "heading1"
  | "paragraph1"
  | "paragraph2"
  | "paragraph3"
  | "label";

interface TypographyProps {
  children?: ReactNode;
  text?: string;
  variant?: TypographyVariant;
  className?: string;
  onClick?: (e) => void;
}

const Typography: React.FC<TypographyProps> = ({
  children,
  text,
  variant = "paragraph1",
  className = "",
  onClick,
}) => {
  const variantClasses = {
    display1: "text-5xl font-semibold",
    display2: "text-[40px] font-semibold",
    display3: "text-[32px] font-semibold",
    display4: "text-2xl font-semibold",
    display4R: "text-2xl",
    heading1: "text-xl font-semibold",
    paragraph1: "text-lg",
    paragraph2: "text-base",
    paragraph3: "text-sm",
    label: "text-xs",
  };

  return (
    <p
      className={cn(
        "leading-160 transition-all",
        variantClasses[variant],
        className
      )}
      onClick={onClick}
    >
      {children}
      {text}
    </p>
  );
};

export default Typography;
