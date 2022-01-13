import * as article from "@/core/article/use-cases/register-article-adapter";
import * as comment from "@/core/article/use-cases/add-comment-to-an-article-adapter";
import { database as dbOps } from "./db";
import { AuthorID } from "@/core/article/types";
import { DBUser } from "@/ports/db-in-memory/db";

export const createUserInDBAdapter = dbOps.createUserInDB
export const login = dbOps.login
export const createArticleInDBAdapter: article.OutsideRegisterArticleType =
  async (data) => {
    const createdArticle = await dbOps.createArticleInDB(data);
    const { authorID, ...articleWithoutAuthorID } = createdArticle.article;
    return {
      article: {
        ...articleWithoutAuthorID,
        favorited: false,
        author: createdArticle.author,
      },
    };
  };
export const addCommentToArticleInDB: comment.OutsideAddCommentToAnArticleType =
  async (data) => {
    const createdComment = await dbOps.addCommentToArticleInDB(data);
    const { authorID, articleID, ...comment } = createdComment.comment;
    return {
      comment: {
        ...comment,
        author: createdComment.author,
      },
    };
  };
export const getCurrentUserAdapter = (userID: AuthorID): Promise<DBUser> =>
  dbOps.getCurrentUser(userID);
