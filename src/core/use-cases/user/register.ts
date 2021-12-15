import { CreatableUser } from "@/core/types/user";
import * as TE from "fp-ts/TaskEither";
import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/function";
import { validateUser } from "./validate-user";

export type OutsideRegister<A> = (data: CreatableUser) => Promise<A>;

export type Register = <A>(
  outsideRegiter: OutsideRegister<A>
) => (data: CreatableUser) => TE.TaskEither<Error, A>;

export const register: Register = (outsideRegister) => (data) => {
  return pipe(
    data,
    validateUser,
    TE.fromEither,
    TE.chain(() => TE.tryCatch(() => outsideRegister(data), E.toError))
  );
};
