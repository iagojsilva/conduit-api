import { CreatableUser, LoginUser } from "@/core/user/types";
import { registerUserAdapter } from "@/core/user/use-cases/user-register-adapter";
import { pipe } from "fp-ts/lib/function";
import * as db from "@/ports/adapters/db";
import * as TE from "fp-ts/TaskEither";
import * as E from "fp-ts/Either";
import { getErrorsMessages } from "../http";
import { AuthorID } from "@/core/article/types";

export const createUser = (data: CreatableUser) => {
  return pipe(
    data,
    registerUserAdapter(db.createUserInDBAdapter),
    TE.mapLeft((error) => getErrorsMessages(error.message))
  );
};

export const login = (data: LoginUser) => {
  return pipe(
    TE.tryCatch(() => db.login(data), E.toError),
    TE.mapLeft((error) => getErrorsMessages(error.message))
  );
};

export const getCurrentUser = (data: { userID: AuthorID; token: string }) => {
  return pipe(
    TE.tryCatch(() => db.getCurrentUserAdapter(data.userID), E.toError),
    TE.map(({ id, password, ...user }) => ({
      user: { ...user, token: data.token },
    })),
    TE.mapLeft((errors) => getErrorsMessages(errors.message))
  );
};
