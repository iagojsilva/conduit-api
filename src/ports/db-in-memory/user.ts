import { DBUser, dbInMemory } from "./db";
import { CreatableUser, LoginUser, UpdatableUser } from "@/core/user/types";
import { v4 as uuidv4 } from "uuid";
import argon2 from 'argon2'
import { AuthorID } from "@/core/article/types";
const _ = require('lodash')

type CreateUserInDB = (data: CreatableUser) => Promise<DBUser>;

export const createUserInDB: CreateUserInDB = async (data) => {
  if (dbInMemory.userByEmail[data.email]) throw new Error('User already registered')
  
  const id = uuidv4();

  const hash = await argon2.hash(data.password)

  dbInMemory.userByEmail[data.email] = id;
  dbInMemory.userByUsername[data.username] = id;

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

export const updateUser = (updatableUser: UpdatableUser) => async (userID: AuthorID): Promise<DBUser> => {
 const currentUser = await getCurrentUser(userID) 
 const userProperties = _.omitBy(updatableUser, _.isNil)

 // Make password's hash
 if (userProperties['password']) {
    const hash = await argon2.hash(userProperties.password)
    userProperties.password = hash
 }

 // Check if email is already being used
 if (userProperties['email']){
   const ID = dbInMemory.userByEmail[userProperties.email]
   if (ID){
     if (ID === userID) throw new Error("This email is already adressed to you")
     throw new Error('This email is already being used')
    }
    delete dbInMemory.userByEmail[currentUser.email]
    dbInMemory.userByEmail[userProperties.email] = userID
 }

 // Check if username is already being used
 if (userProperties['username']){
   const ID = dbInMemory.userByUsername[userProperties.username]
   if (ID){
     if (ID === userID) throw new Error("This username is already adressed to you")
     throw new Error('This username is already being used')
    }
    delete dbInMemory.userByUsername[currentUser.username]
    dbInMemory.userByUsername[userProperties.username] = userID
 }

 const updatedUser: DBUser = {...currentUser, ...userProperties}
 dbInMemory.users[userID] = updatedUser
 return updatedUser
}