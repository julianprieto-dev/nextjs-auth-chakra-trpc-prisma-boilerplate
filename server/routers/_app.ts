import { createRouter } from "../createRouter";
import { userRouter } from "./user";

export const appRouter = createRouter()
  .query("healthz", {
    async resolve() {
      return "yay!";
    },
  })
  .merge("user.", userRouter);

export type AppRouter = typeof appRouter;
