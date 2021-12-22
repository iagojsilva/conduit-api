import { CommentOutput } from "@/core/types/comment";
import {
  addComentToAnArticle as addComentToAnArticleCore,
  AddComentToAnArticle,
  OutsideAddComentToAnArticle,
} from "@/core/use-cases/articles/create-comment";

export type OutsideAddCommentToAnArticleType = OutsideAddComentToAnArticle<{
  comment: CommentOutput;
}>;

export const addCommentToAnArticleAdapter: AddComentToAnArticle =
  (outsideAddComentToAnArticle) => (data) =>
    addComentToAnArticleCore(outsideAddComentToAnArticle)(data);
