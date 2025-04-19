import OnboardBg from "@/app/(authentication)/_components/OnboardBg";
import Typography from "@/app/(dashboard)/_components/Typography";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MailOpen } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";

const NotifyAdmin = ({
  dialogOpen,
  setDialogOpen,
}: {
  dialogOpen: boolean;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [email, setEmail] = useState<string>("");

  const sendMail = async () => {
    if (!email) toast.error("Email is required!");

    let toastId: string | number = "";

    toastId = toast("Sending mail...", { duration: Infinity });
    // const html = <Typography text="Email demo test" />;
    const text = "Email demo test";
    const res = await fetch("/api/email", {
      method: "POST",
      body: JSON.stringify({ to: email, subject: "Join 101", text }),
    });
    if (res.status == 200) toast.success("Email sent successfull!");
    else toast.error("Error sending email!");

    if (toastId) toast.dismiss(toastId);
  };

  return (
    <p className="mt-2 text-grey/400 font-semibold">
      In case you are not an admin of your slack, click here to{" "}
      <Dialog open={dialogOpen} onOpenChange={(value) => setDialogOpen(value)}>
        <DialogTrigger className="underline text-dark cursor-pointer">
          notify your Slack admin.
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>
            <span className="relative">
              <span className="absolute -top-6 -left-6">
                <OnboardBg />
                <span className="absolute top-3 left-3 border-8 border-grey-200 rounded-full p-[14px] bg-secondary-400-main">
                  <MailOpen className="text-main-400" size={24} />
                </span>
              </span>
            </span>
          </DialogTitle>
          <div className="mt-8 py-4 px-6 relative z-10">
            <Typography
              text="Notify your Slack admin"
              variant="paragraph1"
              className="font-bold text-dark"
            />
            <Typography variant="paragraph3" className="text-grey/400 mt-1">
              Enter your Slack admin email and ask the admin to check out this
              new tool that can help <span className="font-bold">zazzy.</span>
            </Typography>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter the email address"
              className="py-[10px] px-[14px] rounded-[8px] border border-grey-300 focus:outline-none w-full mt-5"
              style={{
                boxShadow: "0px 1px 2px 0px #1018280D",
              }}
            />
            <div className="mt-8 flex gap-3">
              <button
                onClick={() => setDialogOpen(false)}
                className="py-[10px] px-4 flex-1 border border-grey-300 rounded-[8px]"
                style={{ boxShadow: "0px 1px 2px 0px #1018280D" }}
              >
                <Typography
                  text="Cancel"
                  variant="paragraph2"
                  className="font-semibold text-grey/400"
                />
              </button>
              <button
                onClick={sendMail}
                className="py-[10px] px-4 flex-1 border border-secondary-400-main bg-secondary-400-main rounded-[8px]"
                style={{ boxShadow: "0px 1px 2px 0px #1018280D" }}
              >
                <Typography
                  text="Send email"
                  variant="paragraph2"
                  className="font-semibold text-main-400"
                />
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </p>
  );
};

export default NotifyAdmin;
