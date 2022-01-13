import { DBUser, dbInMemory } from "./db";
import { CreatableUser, LoginUser } from "@/core/user/types";
import { v4 as uuidv4 } from "uuid";
import argon2 from 'argon2'
import { AuthorID } from "@/core/article/types";

type CreateUserInDB = (data: CreatableUser) => Promise<DBUser>;

export const createUserInDB: CreateUserInDB = async (data) => {
  if (dbInMemory.userByEmail[data.email]) throw new Error('User already registered')
  
  const id = uuidv4();

  const hash = await argon2.hash(data.password)

  dbInMemory.userByEmail[data.email] = id;

  return (dbInMemory.users[id] = {
    id,
    email: data.email,
    username: data.username,
    password: hash,
    bio: '',
    image: ''
  });
};

type Login = (data: LoginUser) => Promise<DBUser>;
export const login: Login = async (data) => {
  const userID = dbInMemory.userByEmail[data.email];
  const user = dbInMemory.users[userID ?? ""];

  if (!user || !(await argon2.verify(user.password, data.password)))
    throw new Error("Invalid email or password");

  return user;
};

export const getCurrentUser = async (userID: AuthorID): Promise<DBUser> => {
  const user = dbInMemory.users[userID]
  if (!user) throw new Error('User unexistent')
  return user
} 