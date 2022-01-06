export * from "@/ports/fastify/server";

import { extractToken, verifyJWT } from "@/ports/adapters/jwt";

export const getErrorsMessages = (errors: string) => {
  return {
    errors: {
      body: errors.split(":::"),
    },
  };
};

export const getToken = (authorizationHeader: string = "") => {
  const token = extractToken(authorizationHeader);
  return verifyJWT(token);
};
