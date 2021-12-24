import * as jwt from "@/ports/jwt/jose";

type JWTPaylaod = {
  [propName: string]: unknown;
};

type ExpirationTime = string;

export const generateTokenAdapter = (
  ...args: [JWTPaylaod, ExpirationTime?]
): Promise<string> => jwt.createJWT(...args);

export const verifyJWT = async (token: string) => {
  const data = await jwt.verifyJWT(token);
  return data.payload;
};
