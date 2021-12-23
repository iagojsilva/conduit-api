import { SignJWT, jwtVerify, JWTPayload } from "jose";
import { env } from "@/helpers";

// Check if jwt is at least 32 char
const JWT_SECRET = env("JWT_SECRET");

export const createJWT = async (
  payload: JWTPayload,
  expirationTime: string = "10m"
) => {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(expirationTime)
    .sign(Buffer.from(JWT_SECRET));
};

export const verifyJWT = async (token: string) => {
  const secret = Buffer.from(JWT_SECRET);
  return await jwtVerify(token, secret);
};
