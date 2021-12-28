import { CreatableComment, creatableCommentCodec } from "@/core/comment/types";
import { pipe } from "fp-ts/function";
import * as TE from "fp-ts/TaskEither";
import * as E from "fp-ts/Either";
import { failure } from "io-ts/PathReporter";

export type OutsideAddComentToAnArticle<A> = (
  data: CreatableComment
) => Promise<A>;

export type AddComentToAnArticle = <A>(
  o: OutsideAddComentToAnArticle<A>
) => (data: CreatableComment) => TE.TaskEither<Error, A>;

export const addComentToAnArticle: AddComentToAnArticle =
  (outsideAddComentToAnArticle) => (data) => {
    return pipe(
      data,
      validateAddCommentToAnArticle,
      TE.fromEither,
      TE.chain(() =>
        TE.tryCatch(() => outsideAddComentToAnArticle(data), E.toError)
      )
    );
  };

type ValidateAddCommentToAnArticle = (
  data: CreatableComment
) => E.Either<Error, CreatableComment>;

const validateAddCommentToAnArticle: ValidateAddCommentToAnArticle = (data) => {
  return pipe(
    data,
    creatableCommentCodec.decode,
    E.mapLeft((errors) => new Error(failure(errors).join(":::")))
  );
};
