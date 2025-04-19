import React from "react";
import Typography from "@/app/(dashboard)/_components/Typography";
import useUserStore from "@/store/user";
import {
  toastFullfilled,
  toastPending,
} from "@/app/(dashboard)/_components/Toast";

interface DisconnectButtonProps {
  label: string;
  google?: boolean;
}

const DisconnectButton: React.FC<DisconnectButtonProps> = ({google}) => {
  const {
    company,
    connectUpdateSlackNotification,
    user,
    connectUpdateCalendarNotification,
  } = useUserStore();
  return (
    <button
      onClick={async () => {
        if (google) {
          if (company) {
            const toastId = toastPending("Disonnecting slack...");
            const res = await connectUpdateSlackNotification({
              companyId: company?.id ?? "",
              slackNotification: false,
            });
            toastFullfilled(
              toastId,
              res,
              "Slack disconnected successfully",
              "Error disconnecting slack"
            );
          }
        } else {
          const toastId = toastPending("Disonnecting calendar...");
            const res = await connectUpdateCalendarNotification({
              userId: user?.id ?? "",
              googleNotification: false,
            });
            toastFullfilled(
              toastId,
              res,
              "Calendar disconnected successfully",
              "Error disconnecting calendar"
            );
          
        }
      }}
      className="px-6 py-3 border-2 border-[#D92D20] text-[#D92D20] rounded-lg hover:bg-red-50 transition-all"
    >
      <Typography
        text="Disconnect Integration"
        variant="paragraph1" // Use the existing paragraph1 variant
        className="font-bold leading-[28.8px] text-[18px] text-[#D92D20] font-['Mulish']"
      />
    </button>
  );
};

export default DisconnectButton;
