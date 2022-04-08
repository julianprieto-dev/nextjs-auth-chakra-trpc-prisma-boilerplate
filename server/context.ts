import * as trpcNext from "@trpc/server/adapters/next";
import { inferAsyncReturnType } from "@trpc/server";
import { verifyAndDecodeAccessToken } from "utils/jwt";

export async function createContext({ req }: trpcNext.CreateNextContextOptions) {
  async function getUserFromHeader() {
    if (req.headers.authorization) {
      try {
        const user = await verifyAndDecodeAccessToken(req.headers.authorization.split(" ")[1]);
        return user;
      } catch (error) {}
    }
    return null;
  }
  const user = await getUserFromHeader();

  return {
    user,
  };
}
export type Context = inferAsyncReturnType<typeof createContext>;
