import { CommentOutput } from "@/core/types/comment";
import * as comment from "@/core/use-cases/articles/create-comment";

export type OutsideAddCommentToAnArticleType =
  comment.OutsideAddComentToAnArticle<{
    comment: CommentOutput;
  }>;

export const addCommentToAnArticleAdapter: comment.AddComentToAnArticle =
  (outsideAddComentToAnArticle) => (data) =>
    comment.addComentToAnArticle(outsideAddComentToAnArticle)(data);
