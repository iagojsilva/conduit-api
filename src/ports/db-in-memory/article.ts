import slugify from "slugify";
import { CreatableArticle } from "@/core/article/types";
import { dbInMemory } from "./db";
import { v4 as uuidv4 } from "uuid";
import { CreatableComment } from "@/core/comment/types";
import { ProfileOutput } from "@/core/profile/types";

const getUserFromDB = (userID: string): ProfileOutput => {
  const user = dbInMemory.users[userID];
  if (!user) throw new Error("There is no author with this ID");
  return {
    username: user.username,
    bio: user.bio ?? "",
    image: user.image ?? "",
    following: false,
  };
};

export const createArticleInDB = async (data: CreatableArticle) => {
  const date = new Date().toISOString();
  const id = uuidv4();

  const author = getUserFromDB(data.authorID);

  const articleSlug = slugify(data.title, { lower: true });

  dbInMemory.articleIDBySlug[articleSlug] = id;

  const createdArticle = (dbInMemory.articles[id] = {
    id,
    slug: articleSlug,
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
    author,
  };
};

export const addCommentToArticleInDB = async (data: CreatableComment) => {
  const articleID = dbInMemory.articleIDBySlug[data.articleSlug] ?? "ID not found";
  const id = Date.now();
  const now = new Date().toISOString();

  const author = getUserFromDB(data.authorID);

  const comment = {
    authorID: data.authorID,
    articleID,
    body: data.body,
    createdAt: now,
    id,
    updatedAt: now,
  };

  // Save the comment in DB
  dbInMemory.comments[articleID] = (dbInMemory.comments[articleID] ?? []).concat([comment]);

  return {
    comment,
    author,
  };
};
