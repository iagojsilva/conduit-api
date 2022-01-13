import { ArticleOutput, CreatableArticle } from "@/core/article/types";
import * as article from "@/core/article/use-cases";
import { pipe } from "fp-ts/lib/function";
import * as db from "@/ports/adapters/db";
import * as TE from "fp-ts/TaskEither";
import { getErrorsMessages } from "../http";
import { CommentOutput, CreatableComment } from "@/core/comment/types";

export const createArticle = (data: CreatableArticle) => {
  return pipe(
    data,
    article.createArticleAdapter(db.createArticleInDBAdapter),
    TE.map(getArticleResponse),
    TE.mapLeft((error) => getErrorsMessages(error.message))
  );
};

export const addCommentToAnArticle = (data: CreatableComment) => {
  return pipe(
    data,
    article.addCommentToAnArticleAdapter(db.addCommentToArticleInDB),
    TE.map(getAddCommentToAnArticleResponse),
    TE.mapLeft((error) => getErrorsMessages(error.message))
  );
};

const getAddCommentToAnArticleResponse = (createdComment: CommentOutput & {authorID: string, articleID: string} ) => {
    const { authorID, articleID, ...comment } = createdComment
    return {
      comment: {
        ...comment,
        author: createdComment.author,
      },
    };
 
}

const getArticleResponse = (article: Omit<ArticleOutput & {authorID: string}, 'favorited'>) => {
  const {authorID, ...finalArticle} = article 
  return {
    article: {
      ...finalArticle,
      favorited: false
    }
  }
}