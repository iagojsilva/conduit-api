import { CreatableUser, creatableUserCodec } from "@/core/user/types";
import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/function";
import { failure } from "io-ts/PathReporter";

type ValidateUser = (data: CreatableUser) => E.Either<Error, unknown>;

export const validateUser: ValidateUser = (data) => {
  return pipe(
    data,
    creatableUserCodec.decode,
    E.mapLeft((errors) => new Error(failure(errors).join(":::")))
  );
};
