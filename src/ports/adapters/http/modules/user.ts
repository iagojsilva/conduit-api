import { CreatableUser, LoginUser, UpdatableUser, UserOutput } from "@/core/user/types";
import { registerUserAdapter } from "@/core/user/use-cases/user-register-adapter";
import { pipe } from "fp-ts/lib/function";
import * as db from "@/ports/adapters/db";
import * as TE from "fp-ts/TaskEither";
import * as E from "fp-ts/Either";
import { getErrorsMessages } from "../http";
import { AuthorID } from "@/core/article/types";
import * as jwt from '@/ports/adapters/jwt'
import { updateUserCoreAdapter } from "@/core/user/use-cases/user-update-adapter";
import { curry } from "lodash";

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

type TokenInformation = { payload: jwt.JWTPayload; authHeader: string }

export const getCurrentUser = (token: TokenInformation) => {
  const userID = token.payload['id'] as AuthorID
  return pipe(
    TE.tryCatch(() => db.getCurrentUserAdapter(userID), E.toError),
    TE.map((user) => getUserResponse({user, token: jwt.extractToken(token.authHeader)})), 
    TE.mapLeft((errors) => getErrorsMessages(errors.message))
  );
};

export const getUserProfile = curry((requesterID: AuthorID, username: string) => {
  return pipe(
    TE.tryCatch(()=>db.getUserProfileAdapter(requesterID)(username), E.toError),
    // TODO: Implement following
    TE.map((user) => ({profile: user})),
    TE.mapLeft((errors) => getErrorsMessages(errors.message))
  );
});

export const follow = (followerID: string) => (followedUsername: string) => {
  return pipe(
    TE.tryCatch(()=>db.follow(followerID)(followedUsername), E.toError),
    TE.map(profile => ({profile})),
    TE.mapLeft((errors) => getErrorsMessages(errors.message))
  );
};

export const unfollow = (unfollowerID: string) => (unfollowedUsername: string) => {
  return pipe(
    TE.tryCatch(()=>db.unfollow(unfollowerID)(unfollowedUsername), E.toError),
    TE.map(profile => ({profile})),
    TE.mapLeft((errors) => getErrorsMessages(errors.message))
  );
};

export const updateUser = (token: TokenInformation) => (data: UpdatableUser) => {
  const userID = token.payload['id'] as AuthorID
  return pipe(
    userID,
    updateUserCoreAdapter(db.updateUserAdapter)(data),
    TE.map((user) => getUserResponse({user, token: jwt.extractToken(token.authHeader)})), 
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
