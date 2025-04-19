import useUserStore from "@/store/user";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import Loader from "./Loader";
import { Role } from "@prisma/client";

const CheckSession = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { sessionFetched, user } = useUserStore();
  const pathname = usePathname();

  useEffect(() => {
    if (user && user.needsOnboarding) {
      if (user.role == "Administrator") router.push(`/onboarding`);
      else router.push("/settings/edit-profile");
    }
  }, [user, router]);

  if (sessionFetched && user)
    return (
      <>
        {user.needsOnboarding ? (
          user.role != Role.Administrator &&
          pathname == "/settings/edit-profile" ? (
            children
          ) : (
            <div className="h-screen w-screen flex justify-center items-center text-2xl font-semibold">
              <Loader logo={true} />
            </div>
          )
        ) : (
          children
        )}
      </>
    );

  return (
    <div className="h-screen w-screen flex justify-center items-center text-2xl font-semibold">
      <Loader logo={true} />
    </div>
  );
};

export default CheckSession;
