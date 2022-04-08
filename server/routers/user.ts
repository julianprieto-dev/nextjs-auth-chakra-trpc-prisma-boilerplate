import { prisma } from "../prisma";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createRouter } from "server/createRouter";

import bcrypt from "bcryptjs";
import { signAccessToken } from "utils/jwt";

const defaultUserSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  name: true,
  email: true,
  password: true,
});

export const userRouter = createRouter()
  .query("all", {
    async resolve() {
      const users = await prisma.user.findMany({
        select: defaultUserSelect,
      });
      return users;
    },
  })
  .query("byId", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input }) {
      const { id } = input;
      const user = await prisma.user.findUnique({
        where: { id },
        select: defaultUserSelect,
      });
      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No user with id '${id}'`,
        });
      }
      return user;
    },
  })
  .mutation("add", {
    input: z.object({
      id: z.string().uuid(),
      email: z.string().min(1),
      password: z.string().min(6),
      name: z.string().min(1).optional(),
    }),
    async resolve({ input }) {
      const user = await prisma.user.create({
        data: input,
        select: defaultUserSelect,
      });
      return user;
    },
  })
  .mutation("edit", {
    input: z.object({
      id: z.string().uuid(),
      data: z.object({
        name: z.string().min(1).max(32).optional(),
      }),
    }),
    async resolve({ input }) {
      const { id, data } = input;
      const user = await prisma.user.update({
        where: { id },
        data,
        select: defaultUserSelect,
      });
      return user;
    },
  })
  .mutation("delete", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input }) {
      const { id } = input;
      await prisma.user.delete({ where: { id } });
      return {
        id,
      };
    },
  })
  .mutation("register", {
    input: z.object({
      name: z.string().min(1).optional(),
      email: z.string().email(),
      password: z.string().min(6),
    }),
    async resolve({ input }) {
      const { name, email, password } = input;
      const encryptedPassword = bcrypt.hashSync(password, 8);

      const user = await prisma.user.create({
        data: { name, email, password: encryptedPassword },
        select: defaultUserSelect,
      });

      const { password: _password, ...userWithoutPassword } = user;

      const accessToken = (await signAccessToken({ id: user.id, email: user.email })) as string;

      return { ...userWithoutPassword, accessToken };
    },
  })
  .mutation("login", {
    input: z.object({
      email: z.string().email(),
      password: z.string().min(6),
    }),
    async resolve({ input }) {
      const { email, password } = input;

      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
      }

      const checkPassword = bcrypt.compareSync(password, user.password);

      if (!checkPassword) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Email address or password not valid" });
      }

      const { password: _password, ...userWithoutPassword } = user;

      const accessToken = (await signAccessToken({ id: user.id, email: user.email })) as string;

      return { ...userWithoutPassword, accessToken };
    },
  });
