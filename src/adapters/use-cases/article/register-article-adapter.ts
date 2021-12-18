import { ArticleOutput } from "@/core/types/article";
import {
  registerArticle as createArticleCore,
  RegisterArticle,
} from "@/core/use-cases/articles/register-article";
import { OutsideArticleRegister } from "@/core/use-cases/articles/register-article";

export type OutsideRegisterArticleType = OutsideArticleRegister<{
  article: ArticleOutput;
}>;

export const createArticleAdapter: RegisterArticle =
  (outsideRegister) => (data) =>
    createArticleCore(outsideRegister)(data);
