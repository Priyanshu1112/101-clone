import React from "react";
import Typography from "@/app/(dashboard)/_components/Typography";

const ProfileDetailsHeader: React.FC = () => {
  return (
    <div>
      {/* Main Title with Accurate Text Color */}
      <Typography
        text="Profile Details"
        variant="heading1"
        className="text-[#2E1B4E] font-semibold mb-1"
      />
      {/* Subtitle with Accurate Color */}
      <Typography
        text="Update your information here"
        variant="paragraph3"
        className="text-[#64748B]"
      />
    </div>
  );
};

export default ProfileDetailsHeader;