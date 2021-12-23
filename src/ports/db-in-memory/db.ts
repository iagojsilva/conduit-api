import * as comment from "@/adapters/use-cases/article/add-comment-to-an-article-adapter";
import * as article from "@/adapters/use-cases/article/register-article-adapter";
import * as user from "@/adapters/use-cases/user/user-register-adapter";
import { User } from "@/adapters/use-cases/user/user-register-adapter";
import slugify from "slugify";

type DBUser = User & { id: number; password: string };

type DB = {
  users: {
    [id: number]: DBUser;
  };
};

const db: DB = {
  users: {},
};

type OutsideRegisterUser = (
  data: user.CreatableUser
) => Promise<DBUser | undefined>;

export const outsideRegisterUser: OutsideRegisterUser = async (data) => {
  const id = Date.now();
  db.users[id] = {
    id,
    email: data.email,
    username: data.username,
    password: data.password,
  };
  return db.users[id];
};

export const outsideArticleRegister: article.OutsideRegisterArticleType =
  async (data) => {
    const date = new Date().toISOString();
    return {
      article: {
        slug: slugify(data.title, { lower: true }),
        title: data.title,
        description: data.description,
        body: data.body,
        tagList: data.tagList ?? [],
        createdAt: date,
        updatedAt: date,
        favorited: false,
        favoritesCount: 0,
        /*  author: {
        username: "jake",
        bio: "I work at statefarm",
        image: "https://i.stack.imgur.com/xHWG8.jpg",
        following: false,
      }, */
      },
    };
  };

export const outsideAddCommentToAnArticle: comment.OutsideAddCommentToAnArticleType =
  async (data) => {
    const date = new Date().toISOString();

    return {
      comment: {
        id: Date.now(),
        createdAt: date,
        updatedAt: date,
        body: data.body,
        /* author: {
          username: "",
          bio: "",
          image: "",
          following: false,
        }, */
      },
    };
  };
