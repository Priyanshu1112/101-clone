import { cn } from "@/lib/utils";
import Typography from "../../_components/Typography";

const FlagText = ({
  pre,
  flagText,
  after,
  split = true,
  className,
}: {
  pre: string;
  flagText: string;
  after: string;
  split?: boolean;
  className?: string;
}) => {
  const [flag, ...country] = split
    ? flagText?.split("-|-")[0]?.split(" ")
    : flagText?.split(" ");
  return (
    <Typography
      variant="display4"
      className={cn("flex items-center gap-2 w-full flex-wrap", className)}
    >
      <span className="whitespace-nowrap">{pre}</span>
      <span className="flex items-center gap-2 min-w-fit flex-wrap">
        <span
          className={cn(`flag flag:${flag}`)}
          style={{ width: "32px", height: "20px" }}
        ></span>{" "}
        {country}
      </span>
      <span className="whitespace-nowrap">{after}</span>
    </Typography>
  );
};

export default FlagText;
