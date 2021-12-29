import { DBUser, db } from "./db";
import { CreatableUser, LoginUser } from "@/core/user/types";
import { v4 as uuidv4 } from "uuid";

type CreateUserInDB = (data: CreatableUser) => Promise<DBUser>;

export const createUserInDB: CreateUserInDB = async (data) => {
  const id = uuidv4();

  db.userByEmail[data.email] = id;

  return (db.users[id] = {
    id,
    email: data.email,
    username: data.username,
    password: data.password,
  });
};

type Login = (data: LoginUser) => Promise<DBUser>;
export const login: Login = async (data) => {
  const userID = db.userByEmail[data.email];
  const user = db.users[userID ?? ""];
  if (!user || user.password !== data.password)
    throw new Error("Invalid email or password");

  return user;
};
