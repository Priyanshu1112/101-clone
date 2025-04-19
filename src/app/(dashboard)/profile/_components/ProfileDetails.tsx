import Typography from "@/app/(dashboard)/_components/Typography";

const ProfileDetails = ({
  details,
}: {
  details: { label: string; value: string }[];
}) => {
  return (
    <div className="grid grid-cols-2 gap-y-6 ">
      {details.map((detail, index) => (
        <div key={index} className="flex flex-col">
          {/* Label */}
          <Typography
            text={detail.label}
            variant="paragraph3"
            className="text-[#667085] text-[14px] font-medium"
          />
          {/* Value */}
          <Typography
            text={detail.value}
            variant="paragraph2"
            className="text-[#101828] text-[16px] font-semibold"
          />
        </div>
      ))}
    </div>
  );
};

export default ProfileDetails;