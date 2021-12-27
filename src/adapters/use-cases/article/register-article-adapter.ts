import { ArticleOutput } from '@/core/types/article'
import {
  registerArticle as createArticleCore,
  RegisterArticle,
  OutsideArticleRegister,
} from '@/core/use-cases/articles/register-article'

export type OutsideRegisterArticleType = OutsideArticleRegister<{
  article: ArticleOutput;
}>;

export const createArticleAdapter: RegisterArticle =
  (outsideRegister) => (data) =>
    createArticleCore(outsideRegister)(data)
