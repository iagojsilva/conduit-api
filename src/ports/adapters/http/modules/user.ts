import { CreatableUser, LoginUser, UserOutput } from "@/core/user/types";
import { registerUserAdapter } from "@/core/user/use-cases/user-register-adapter";
import { pipe } from "fp-ts/lib/function";
import * as db from "@/ports/adapters/db";
import * as TE from "fp-ts/TaskEither";
import * as E from "fp-ts/Either";
import { getErrorsMessages } from "../http";
import { AuthorID } from "@/core/article/types";
import * as jwt from '@/ports/adapters/jwt'

export const createUser = (data: CreatableUser) => {
  return pipe(
    data,
    registerUserAdapter(db.createUserInDBAdapter),
    TE.chain(user => pipe(
      TE.tryCatch(()=> jwt.generateTokenAdapter({id: user.id}), E.toError),
      TE.map(token => ({user, token}))
      ) 
    ),
    TE.map(getUserResponse),
    TE.mapLeft((error) => getErrorsMessages(error.message))
  );
};

export const login = (data: LoginUser) => {

  return pipe(
    TE.tryCatch(() => db.login(data), E.toError),
    TE.chain(user => pipe(
      TE.tryCatch(()=> jwt.generateTokenAdapter({id: user.id}), E.toError),
      TE.map(token => ({user, token}))
    )),
    TE.map(getUserResponse),
    TE.mapLeft((error) => getErrorsMessages(error.message))
  );
};

export const getCurrentUser = (data: { userID: AuthorID; authHeader: string }) => {
  return pipe(
    TE.tryCatch(() => db.getCurrentUserAdapter(data.userID), E.toError),
    TE.map((user) => getUserResponse({user, token: jwt.extractToken(data.authHeader)})), 
    TE.mapLeft((errors) => getErrorsMessages(errors.message))
  );
};

type GetUserResponseInput = {
  user: db.database.DBUser,
  token: string
}

const getUserResponse = ({user, token}: GetUserResponseInput): {user: UserOutput} => {
  return {
    user: {
      email: user.email,
      username: user.username,
      bio: user.bio ?? '',
      image: user.image ?? '',
      token
    }
  }
}