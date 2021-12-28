import { CommentOutput } from "@/core/comment/types";
import * as comment from "./add-comment-to-an-article";

export type OutsideAddCommentToAnArticleType =
  comment.OutsideAddComentToAnArticle<{ comment: CommentOutput }>;

export const addCommentToAnArticleAdapter: comment.AddComentToAnArticle =
  (outsideAddComentToAnArticle) => (data) =>
    comment.addComentToAnArticle(outsideAddComentToAnArticle)(data);
