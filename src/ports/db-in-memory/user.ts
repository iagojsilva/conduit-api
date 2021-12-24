import { DBUser, db } from "./db";
import { CreatableUser } from "@/core/types/user";
import { v4 as uuidv4 } from "uuid";

type CreateUserInDB = (data: CreatableUser) => Promise<DBUser>;

export const createUserInDB: CreateUserInDB = async (data) => {
  const id = uuidv4();
  return (db.users[id] = {
    id,
    email: data.email,
    username: data.username,
    password: data.password,
  });
};
