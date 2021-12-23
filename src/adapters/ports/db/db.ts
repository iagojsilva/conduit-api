import * as article from "@/adapters/use-cases/article/register-article-adapter";
import * as comment from "@/adapters/use-cases/article/add-comment-to-an-article-adapter";
import * as user from "@/adapters/use-cases/user/user-register-adapter";
import * as db from "@/ports/db-in-memory";
import { generateTokenAdapter } from "../jwt";

export const createUserDBAdapter: user.OutsideRegisterUser = async (data) => {
  const registeredUser = await db.outsideRegisterUser(data);
  if (!registeredUser) throw new Error("Error registering user");

  const token = await generateTokenAdapter({ id: registeredUser.id });
  return {
    user: {
      username: registeredUser.username,
      email: registeredUser.email,
      bio: "",
      image: undefined,
      token,
    },
  };
};

export const createArticleDBAdapter: article.OutsideRegisterArticleType = (
  data
) => db.outsideArticleRegister(data);

export const addCommentToArticleInDB: comment.OutsideAddCommentToAnArticleType =
  (data) => db.outsideAddCommentToAnArticle(data);
