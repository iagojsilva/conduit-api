import { UserOutput } from "@/core/user/types";
import { ArticleOutput } from "@/core/article/types";
import { CommentOutput } from "@/core/comment/types";

export type DBUser = Omit<UserOutput, "token"> & {
  id: string;
  password: string;
};
export type DBArticle = Omit<ArticleOutput, "favorited" | "author"> & {
  id: string;
  authorID: string;
};

export type DBComment = Omit<CommentOutput, "author"> & {
  articleID: string;
  authorID: string;
};

type DB = {
  users: { [id: string]: DBUser };
  articles: { [id: string]: DBArticle };
  articleIDBySlug: { [slug: string]: string };
  comments: { [articleID: string]: Array<DBComment> };
};

export const db: DB = {
  users: {},
  articles: {},
  articleIDBySlug: {},
  comments: {},
};
