import EditIcon from "@assets/editIcon";
import Typography from "@/app/(dashboard)/_components/Typography";
import Link from "next/link";

const EditProfileButton = () => {
  return (
    <Link
      href={"/settings/edit-profile"}
      className="flex items-center gap-2 px-4 py-2 border border-[#D0D5DD] rounded-md hover:bg-[#F9FAFB] shadow-sm max-w-fit"
      style={{ boxShadow: "0px 1px 2px 0px #1018280D" }}
    >
      <EditIcon />
      <Typography
        text="Edit profile"
        variant="paragraph3"
        className="text-[#344054] font-semibold"
      />
    </Link>
  );
};

export default EditProfileButton;
