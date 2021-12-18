import { CreatableArticle } from "@/core/types/article";
import { pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/lib/TaskEither";
import * as E from "fp-ts/Either";

export type OutsideRegister<A> = (data: CreatableArticle) => Promise<A>;

type RegisterArticle = <A>(
  outsideRegister: OutsideRegister<A>
) => (data: CreatableArticle) => TE.TaskEither<Error, A>;

export const registerArticle: RegisterArticle = (outsideRegister) => (data) => {
  return pipe(TE.tryCatch(() => outsideRegister(data), E.toError));
};
