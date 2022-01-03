import * as jwt from "@/ports/jwt/jose";

export type JWTPayload = {
  [id: string]: unknown;
};

type ExpirationTime = string;

export const generateTokenAdapter = (
  ...args: [JWTPayload, ExpirationTime?]
): Promise<string> => jwt.createJWT(...args);

export const verifyJWT = async (token: string) => {
  const data = await jwt.verifyJWT(token);
  return data.payload as JWTPayload;
};
