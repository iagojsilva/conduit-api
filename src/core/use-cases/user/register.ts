import { CreatableUser } from "@/core/types/user";
import * as TE from "fp-ts/TaskEither";
import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/function";

export type OutsideRegister<A> = (data: CreatableUser) => Promise<A>;

export type Register = <A>(
  outsideRegiter: OutsideRegister<A>
) => (data: CreatableUser) => TE.TaskEither<Error, A>;

export const register: Register = (outsideRegister) => (data) => {
  return pipe(TE.tryCatch(() => outsideRegister(data), E.toError));
};
