import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/_authOptions";

export const userSession = async () => await getServerSession(authOptions);
