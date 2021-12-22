import { OutsideRegisterArticleType } from "@/adapters/use-cases/article/register-article-adapter";
import { OutsideAddCommentToAnArticleType } from "@/adapters/use-cases/article/add-comment-to-an-article-adapter";
import { OutsideRegisterType } from "@/adapters/use-cases/user/user-register-adapter";
import {
  outsideAddCommentToAnArticle,
  outsideArticleRegister,
  outsideRegister,
} from "@/ports/db-in-memory";

export const createUserDBAdapter: OutsideRegisterType = (data) =>
  outsideRegister(data);

export const createArticleDBAdapter: OutsideRegisterArticleType = (data) =>
  outsideArticleRegister(data);

export const addCommentToArticleInDB: OutsideAddCommentToAnArticleType = (
  data
) => outsideAddCommentToAnArticle(data);
