import Typography from "@/app/(dashboard)/_components/Typography";
import Google from "@/assets/Google";
import Slack from "@/assets/Slack";
import useUserStore from "@/store/user";
import { Provider } from "@prisma/client";

const LoggedVia = () => {
  const { user } = useUserStore();
  const isGoogle = user?.lastSignInProvider == Provider.Google;
  const isSlack = user?.lastSignInProvider == Provider.Slack;

  return (
    <span className="flex gap-3 items-center text-grey/350">
      {isSlack ? <Slack size={20} /> : isGoogle ? <Google size={20} /> : ""}
      <Typography
        variant="paragraph2"
        text={`Logged in with ${isSlack ? "Slack" : isGoogle ? "Google" : ""}`}
        className="font-semibold"
      />
    </span>
  );
};

export default LoggedVia;
