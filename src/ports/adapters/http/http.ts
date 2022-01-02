export * from "@/ports/fastify/server";

export const getErrorsMessages = (errors: string) => {
  return {
    errors: {
      body: errors.split(":::"),
    },
  };
};
