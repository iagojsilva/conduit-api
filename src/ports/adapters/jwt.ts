import { AuthorID } from "@/core/article/types";
import * as jwt from "@/ports/jwt/jose";

export type JWTPayload = {
  [id: string]: AuthorID;
};

type ExpirationTime = string;

export const generateTokenAdapter = (
  ...args: [JWTPayload, ExpirationTime?]
): Promise<string> => jwt.createJWT(...args);

export const verifyJWT = async (token: string) => {
  const data = await jwt.verifyJWT(token);
  return data.payload as JWTPayload;
};
