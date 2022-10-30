import { UserOutput } from "@/core/user/types";
import { ArticleOutput } from "@/core/article/types";
import { CommentOutput } from "@/core/comment/types";
import { ProfileOutput } from "@/core/profile/types";

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
export type ProfileDB = ProfileOutput
export type UserID = string;

type DBInMemory = {
  users: { [id: string]: DBUser };
  userByEmail: { [email: string]: UserID };
  userByUsername: { [username: string]: UserID };
  articles: { [id: string]: DBArticle };
  articleIDBySlug: { [slug: string]: string };
  comments: { [articleID: string]: Array<DBComment> };
  profiles: {[username: string]: ProfileDB}
  following: {[userID: string]: Array<string>}
};

export const dbInMemory: DBInMemory = {
  users: {},
  userByEmail: {},
  userByUsername: {},
  articles: {},
  articleIDBySlug: {},
  comments: {},
  profiles: {},
  following: {}
};
