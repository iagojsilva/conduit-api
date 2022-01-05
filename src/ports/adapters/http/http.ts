export * from "@/ports/express/server";

export const getErrorsMessages = (errors: string) => {
  return {
    errors: {
      body: errors.split(":::"),
    },
  };
};
