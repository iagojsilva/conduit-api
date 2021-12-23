import * as jwt from "@/ports/jwt/jose";

type JWTPaylaod = {
  [propName: string]: unknown;
};

type ExpirationTime = string;

export const generateTokenAdapter = (
  ...args: [JWTPaylaod, ExpirationTime?]
): Promise<string> => {
  return jwt.createJWT(...args);
};
