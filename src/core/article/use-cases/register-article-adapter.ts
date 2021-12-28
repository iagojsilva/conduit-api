import { ArticleOutput } from "@/core/article/types";
import {
  registerArticle as createArticleCore,
  RegisterArticle,
  OutsideArticleRegister,
} from "./register-article";

export type OutsideRegisterArticleType = OutsideArticleRegister<{
  article: ArticleOutput;
}>;

export const createArticleAdapter: RegisterArticle =
  (outsideRegister) => (data) =>
    createArticleCore(outsideRegister)(data);
