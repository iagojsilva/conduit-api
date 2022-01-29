import { UpdatableUser, updatableUserCodec } from "@/core/user/types";
import * as TE from "fp-ts/TaskEither";
import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/function";
import { failure } from "io-ts/lib/PathReporter";
import { AuthorID } from "@/core/article/types";

export type OutsideUpdate<A> = (data: UpdatableUser) => (userID: AuthorID) => Promise<A>;

export type UpdateUser = <A>(
  outsideRegiter: OutsideUpdate<A>
) => (data: UpdatableUser) => (userID: AuthorID)=> TE.TaskEither<Error, A>;

export const updateUser: UpdateUser = (outsideRegister) => (data) => (userID) => {
  return pipe(
    data,
    validateUpdatableUser,
    TE.fromEither,
    TE.chain(() => TE.tryCatch(() => outsideRegister(data)(userID), E.toError))
  );
};


type ValidateUpdatableUser = (data: UpdatableUser) => E.Either<Error, unknown>;

export const validateUpdatableUser: ValidateUpdatableUser = (data) => {
  return pipe(
    data,
    updatableUserCodec.decode,
    E.mapLeft((errors) => new Error(failure(errors).join(":::")))
  );
};
