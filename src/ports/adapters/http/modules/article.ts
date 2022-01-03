import { CreatableArticle } from "@/core/article/types";
import * as article from "@/core/article/use-cases";
import { pipe } from "fp-ts/lib/function";
import * as db from "@/ports/adapters/db";
import * as TE from "fp-ts/TaskEither";
import { getErrorsMessages } from "../http";
import { CreatableComment } from "@/core/comment/types";

export const createArticle = (data: CreatableArticle) => {
  return pipe(
    data,
    article.createArticleAdapter(db.createArticleInDBAdapter),
    TE.mapLeft((error) => getErrorsMessages(error.message))
  );
};

export const addCommentToAnArticle = (data: CreatableComment) => {
  return pipe(
    data,
    article.addCommentToAnArticleAdapter(db.addCommentToArticleInDB),
    TE.mapLeft((error) => getErrorsMessages(error.message))
  );
};
