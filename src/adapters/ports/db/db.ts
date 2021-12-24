import * as article from "@/adapters/use-cases/article/register-article-adapter";
import * as comment from "@/adapters/use-cases/article/add-comment-to-an-article-adapter";
import * as user from "@/adapters/use-cases/user/user-register-adapter";
import * as db from "@/ports/db-in-memory";
import { generateTokenAdapter } from "../jwt";

export const createUserInDBAdapter: user.OutsideRegisterUser = async (data) => {
  const createdUser = await db.createUserInDB(data);
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
    const createdArticle = await db.createArticleInDB(data);
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
  (data) => db.addCommentToArticleInDB(data);
