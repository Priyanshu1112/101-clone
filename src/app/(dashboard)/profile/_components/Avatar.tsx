import Typography from "@/app/(dashboard)/_components/Typography";
import AvatarIcon from "@/assets/AvatarIcon";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Avatar = ({
  name,
  email,
  approver,
  team,
}: {
  name: string;
  email: string;
  approver: string;
  team: string[];
}) => {
  return (
    <div className="flex flex-col border-b border-[#F2F4F7] pb-6 ">
      {/* Profile Icon */}
      <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center">
        <AvatarIcon size={48} color="#0ABEFF" />{" "}
        {/* Adjusted size for better fit */}
      </div>

      {/* User Name */}
      <div className="my-3">
        <Typography
          text={name}
          variant="heading1"
          className="text-[#101828] font-semibold text-[20px] leading-[32px] text-left"
        />

        {/* User Email */}
        <Typography
          text={email}
          variant="paragraph1"
          className="text-[#667085] text-[16px] leading-[25.6px] text-left"
        />
      </div>
      {/* Approver and Team */}
      <div className="grid grid-cols-2 mt-2">
        {/* Approver */}
        <div className="flex flex-col space-y-1">
          <Typography
            text="Approver"
            variant="paragraph3"
            className="text-[#667085] text-[14px] font-medium"
          />
          <Typography
            text={approver}
            variant="paragraph1"
            className="text-[#344054] font-semibold text-[16px]"
          />
        </div>

        {/* Team */}
        <div className="flex flex-col space-y-1 text-left">
          <Typography
            text="Team"
            variant="paragraph3"
            className="text-[#667085] text-[14px] font-medium"
          />
          {team ? (
            team.length == 1 ? (
              <Typography
                text={team[0]}
                variant="paragraph1"
                className="text-[#344054] font-semibold text-[16px]"
              />
            ) : (
              <Typography
                variant="paragraph1"
                className="text-[#344054] font-semibold text-[16px] whitespace-nowrap"
              >
                {team?.[0] || "No Team"}, +
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <u>{Math.max(team?.length - 1 || 0, 0)}</u>
                    </TooltipTrigger>
                    <TooltipContent
                      align="center"
                      className="py-2 px-3 shadow-sm"
                    >
                      {team?.slice(1)?.map((team, index) => (
                        <Typography
                          key={index}
                          text={team}
                          variant="label"
                          className="text-grey/500"
                        />
                      ))}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Typography>
            )
          ) : (
            <Typography
              text={"No team"}
              variant="paragraph1"
              className="text-[#344054] font-semibold text-[16px] italic"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Avatar;
