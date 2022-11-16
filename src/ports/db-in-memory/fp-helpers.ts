import { isEqual, isNil } from "lodash";
import {
  DBInMemory,
  DatabaseKeys,
  dbInMemory,
  ProfileDB,
  DBUser,
  DBComment,
  DBArticle,
  UserID,
} from "./db";

const build = (db: DBInMemory) => (key: DatabaseKeys) => (id: string) => {
  const r = db[key][id];
  if (isNil(r)) {
    throw new Error("key/id not found");
  }
  return r;
};

const buildDB = build(dbInMemory);
type G<T> = (id: string) => T;
export const following = buildDB("following") as G<Array<string>>;
export const users = buildDB("users") as G<DBUser>;
export const profiles = buildDB("profiles") as G<ProfileDB>;
export const comments = buildDB("comments") as G<Array<DBComment>>;
export const articleIDBySlug = buildDB("articleIDBySlug") as G<string>;
export const articles = buildDB("articles") as G<DBArticle>;
export const userByEmail = buildDB("userByEmail") as G<UserID>;
export const userByUsername = buildDB("userByUsername") as G<UserID>;

const save =
  (dbInMemory: DBInMemory) =>
  (key: DatabaseKeys) =>
  (id: string) =>
  (value: ReturnType<typeof following>) => {
    dbInMemory[key][id] = value;
    console.log("saving in db... ", value);
    return value;
  };

const saveDB = save(dbInMemory);
export const saveFollowing = saveDB("following");

type All = { p: ProfileDB; following: Array<string>; u: DBUser };

export const isFollowingHimself = (a: All) => {
  const message = "You can not follow yourself";
  if (isEqual(a.p.username, a.u.username)) {
    throw new Error(message);
  }
  return a;
};

export const includes = <T>(xs: Array<T>, x: T) => xs.includes(x);

const removeFromArray = <T>(xs: Array<T>, v: T) => xs.filter((x) => x !== v);

export const unfollowF = (a: All): Array<string> =>
  removeFromArray(a.following, a.p.username);
