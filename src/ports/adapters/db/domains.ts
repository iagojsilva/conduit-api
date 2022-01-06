import * as article from "@/core/article/use-cases/register-article-adapter";
import * as comment from "@/core/article/use-cases/add-comment-to-an-article-adapter";
import * as user from "@/core/user/use-cases/user-register-adapter";
import { database as dbOps } from "./db";
import { generateTokenAdapter } from "../jwt";
import { LoginUser, UserOutput } from "@/core/user/types";
import { AuthorID } from "@/core/article/types";
import { DBUser } from "@/ports/db-in-memory/db";

export const createUserInDBAdapter: user.OutsideRegisterUser = async (data) => {
  const createdUser = await dbOps.createUserInDB(data);
  const token = await generateTokenAdapter({ id: createdUser.id });
  return {
    user: {
      username: createdUser["username"],
      email: createdUser["email"],
      bio: "",
      image: "",
      token,
    },
  };
};

export type Login = (data: LoginUser) => Promise<{ user: UserOutput }>;

export const login: Login = async (data) => {
  const user = await dbOps.login(data);
  const token = await generateTokenAdapter({ id: user.id });

  return {
    user: {
      email: user.email,
      username: user.username,
      bio: user.bio,
      image: user.image,
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
