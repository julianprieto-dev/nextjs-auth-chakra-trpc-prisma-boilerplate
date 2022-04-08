import jwt from "jsonwebtoken";
import { TRPCError } from "@trpc/server";

const accessTokenSecret: string = process.env.ACCESS_TOKEN_SECRET ?? "";

export const signAccessToken = (payload: { id: string; email: string }) => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, accessTokenSecret, {}, (err, token) => {
      if (err) {
        reject(new TRPCError({ code: "UNAUTHORIZED" }));
      }
      resolve(token);
    });
  });
};

export const verifyAndDecodeAccessToken = (token: string) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, accessTokenSecret, (err, payload) => {
      if (err) {
        const message = err.name == "JsonWebTokenError" ? "Unauthorized" : err.message;
        return reject(message);
      }
      resolve(payload);
    });
  });
};
