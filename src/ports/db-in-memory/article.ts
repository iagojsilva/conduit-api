import * as comment from "@/adapters/use-cases/article/add-comment-to-an-article-adapter";

import slugify from "slugify";
import { CreatableArticle } from "@/core/types/article";
import { db } from "./db";
import { v4 as uuidv4 } from "uuid";

/* type CreateArticleInDB = (data: CreatableArticle) => Promise<DBArticle>;
 */
export const createArticleInDB = async (data: CreatableArticle) => {
  const date = new Date().toISOString();
  const id = uuidv4();

  const author = db.users[data.authorID];
  if (!author) throw new Error("There is no author with this ID");

  const createdArticle = (db.articles[id] = {
    id,
    slug: slugify(data.title, { lower: true }),
    title: data.title,
    description: data.description,
    body: data.body,
    tagList: data.tagList ?? [],
    createdAt: date,
    updatedAt: date,
    favoritesCount: 0,
    authorID: data.authorID,
  });

  return {
    article: createdArticle,
    author: {
      email: author.email,
      username: author.username,
      bio: author.bio,
      image: author.image,
      following: false,
    },
  };
};

export const addCommentToArticleInDB: comment.OutsideAddCommentToAnArticleType =
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
