import { Article } from "@/core/types/article";
import {
  registerArticle as createArticleCore,
  RegisterArticle,
} from "@/core/use-cases/articles/register-article";
import { OutsideArticleRegister } from "@/core/use-cases/articles/register-article";

export type OutsideRegisterArticleType = OutsideArticleRegister<{
  article: Article;
}>;

export const registerArticle: RegisterArticle = (outsideRegister) => (data) =>
  createArticleCore(outsideRegister)(data);
