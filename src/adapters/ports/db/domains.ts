import * as article from "@/adapters/use-cases/article/register-article-adapter";
import * as comment from "@/adapters/use-cases/article/add-comment-to-an-article-adapter";
import * as user from "@/adapters/use-cases/user/user-register-adapter";
import { database as dbOps } from "./db";
import { generateTokenAdapter } from "../jwt";

export const createUserInDBAdapter: user.OutsideRegisterUser = async (data) => {
  const createdUser = await dbOps.createUserInDB(data);
  const token = await generateTokenAdapter({ id: createdUser.id });
  return {
    user: {
      username: createdUser.username,
      email: createdUser.email,
      bio: "",
      image: undefined,
      token,
    },
  };
};

export const createArticleInDBAdapter: article.OutsideRegisterArticleType =
  async (data) => {
    const createdArticle = await dbOps.createArticleInDB(data);
    const { authorID, ...articleWithoutAuthorID } = createdArticle.article;
    return {
      article: {
        ...articleWithoutAuthorID,
        favorited: false,
      },
      author: createdArticle.author,
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
