import { DBUser, db } from "./db";
import { CreatableUser, LoginUser } from "@/core/user/types";
import { v4 as uuidv4 } from "uuid";
import argon2 from 'argon2'

type CreateUserInDB = (data: CreatableUser) => Promise<DBUser>;

export const createUserInDB: CreateUserInDB = async (data) => {
  if (db.userByEmail[data.email]) throw new Error('User already registered')
  
  const id = uuidv4();

  const hash = await argon2.hash(data.password)

  db.userByEmail[data.email] = id;

  return (db.users[id] = {
    id,
    email: data.email,
    username: data.username,
    password: hash,
  });
};

type Login = (data: LoginUser) => Promise<DBUser>;
export const login: Login = async (data) => {
  const userID = db.userByEmail[data.email];
  const user = db.users[userID ?? ""];

  if (!user || !(await argon2.verify(user.password, data.password)))
    throw new Error("Invalid email or password");

  return user;
};
