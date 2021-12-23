import * as article from "@/adapters/use-cases/article/register-article-adapter";
import * as comment from "@/adapters/use-cases/article/add-comment-to-an-article-adapter";
import * as user from "@/adapters/use-cases/user/user-register-adapter";
import * as db from "@/ports/db-in-memory";

export const createUserDBAdapter: user.OutsideRegisterUser = (data) =>
  db.outsideRegisterUser(data);

export const createArticleDBAdapter: article.OutsideRegisterArticleType = (
  data
) => db.outsideArticleRegister(data);

export const addCommentToArticleInDB: comment.OutsideAddCommentToAnArticleType =
  (data) => db.outsideAddCommentToAnArticle(data);
