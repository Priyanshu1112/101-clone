import Typography from "@/app/(dashboard)/_components/Typography";

const Footer = ({ contact = false }: { contact?: boolean }) => {
  return (
    <div className="w-full flex justify-between text-grey/350 ">
      <Typography
        variant="paragraph2"
        text="Copyright 2025 Ylem Softwares Pvt Ltd"
        className="font-semibold"
      />
      <span className="flex gap-[30px]">
        {contact && (
          <Typography
            variant="paragraph2"
            text="Contact us"
            className="font-semibold"
          />
        )}
        <Typography
          variant="paragraph2"
          text="Terms of use"
          className="font-semibold"
        />
        <Typography
          variant="paragraph2"
          text="Privacy policy"
          className="font-semibold"
        />
      </span>
    </div>
  );
};

export default Footer;
