"use client";
import Logo from "@/assets/Logo";
import Google from "@/assets/Google";
import Typography from "@/app/(dashboard)/_components/Typography";
import Slack from "@/assets/Slack";
import LeftIllustration from "../_components/LeftIllustration";
import Footer from "../_components/Footer";
import { signIn } from "next-auth/react";

const Login = () => {
  return (
    <div className="w-full h-full flex gap-[130px] items-end">
      <span className="flex flex-col gap-7">
        <LeftIllustration />
        <Footer />
      </span>
      <div className="w-[301px] text-secondary-400-main flex flex-col items-center">
        <Logo width={144} height={64} />
        <div className="mt-[165px] w-full">
          <button
            onClick={() =>
              signIn("google", {
                redirect: true,
                callbackUrl: "/",
              })
            }
            className="px-4 py-[10px] bg-white rounded-[8px] flex items-center gap-3 w-full justify-center"
          >
            <Google />{" "}
            <Typography
              variant="paragraph2"
              className="font-semibold text-grey/500"
              text="Connect with Google"
            />
          </button>
          <button
            onClick={() =>
              signIn("slack", {
                redirect: true,
                callbackUrl: "/",
              })
            }
            className="px-4 py-[10px] bg-white rounded-[8px] flex mt-6 items-center gap-3 w-full justify-center"
          >
            <Slack size={24} />{" "}
            <Typography
              variant="paragraph2"
              className="font-semibold text-grey/500"
              text="Connect with Slack"
            />
          </button>
          {/* <Link
            href={
              "https://slack.com/oauth/v2/authorize?client_id=7982655779670.8018292032832&scope=channels:history,channels:write.invites,chat:write,chat:write.public,commands,groups:history,groups:write,im:history,im:write,mpim:history,mpim:write,users:read.email,users:read&user_scope=chat:write,users:read,users:read.email,channels:history,channels:write,im:history,mpim:history"
            }
            className="px-4 py-[10px] bg-white rounded-[8px] flex items-center gap-3 mt-6 w-full justify-center"
          >
            <Slack />{" "}
            <Typography
              variant="paragraph2"
              className="font-semibold text-grey/500"
              text="Connect with Slack"
            />
          </Link> */}
        </div>
        <Typography
          variant="paragraph2"
          className="font-bold text-grey/500 mt-[265px]"
          text="Facing any problem? Contact us"
        />
      </div>
    </div>
  );
};

export default Login;

/* <a href="https://slack.com/oauth/v2/authorize?client_id=7982655779670.8018292032832&scope=channels:history,channels:write.invites,chat:write,chat:write.public,commands,groups:history,groups:write,im:history,im:write,mpim:history,mpim:write,users:read.email,users:read&user_scope=chat:write,users:read,users:read.email,channels:history,channels:write,im:history,mpim:history"><img alt="Add to Slack" height="40" width="139" src="https://platform.slack-edge.com/img/add_to_slack.png" srcSet="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x" /></a> */
/* <button onClick={() => signIn("google")}>Sign in with Google</button> */
