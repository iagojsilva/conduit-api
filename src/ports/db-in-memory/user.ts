import { DBUser, dbInMemory } from "./db";
import { CreatableUser, LoginUser, UpdatableUser } from "@/core/user/types";
import { v4 as uuidv4 } from "uuid";
import argon2 from 'argon2'
import { AuthorID } from "@/core/article/types";
import { omitBy, isNil} from 'lodash'
import { ProfileDB } from ".";
import { toProfile } from "@/core/profile/types";

type CreateUserInDB = (data: CreatableUser) => Promise<DBUser>;
export const createUserInDB: CreateUserInDB = async (data) => {
  if (dbInMemory.userByEmail[data.email]) throw new Error('User already registered')
  
  const id = uuidv4();

  const hash = await argon2.hash(data.password)

  // Add some databases entries
  dbInMemory.userByEmail[data.email] = id;
  dbInMemory.userByUsername[data.username] = id;
  
  const profile: ProfileDB = {
   username: data.username, 
   bio: '',
   image: '',
  }
  dbInMemory.profiles[data.username] = profile

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

export const getUserProfile = async (username: string): Promise<ProfileDB> => {
  const profile = dbInMemory.profiles[username]
  if (!profile) throw new Error("User doesn't exist")
  return profile
}

export const updateUser = (updatableUser: UpdatableUser) => async (userID: AuthorID): Promise<DBUser> => {
 const currentUser = await getCurrentUser(userID) 
 const userProperties = omitBy(updatableUser, isNil)

 // Make password's hash
 if (userProperties['password']) {
    const hash = await argon2.hash(userProperties['password'])
    userProperties['password'] = hash
 }

 // Check if email is already being used
 if (userProperties['email']){
   const ID = dbInMemory.userByEmail[userProperties['email']]
   if (ID){
     if (ID === userID) throw new Error("This email is already adressed to you")
     throw new Error('This email is already being used')
    }
    delete dbInMemory.userByEmail[currentUser.email]
    dbInMemory.userByEmail[userProperties['email']] = userID
 }

 // Check if username is already being used
 if (userProperties['username']){
   const ID = dbInMemory.userByUsername[userProperties['username']]
   if (ID){
     if (ID === userID) throw new Error("This username is already adressed to you")
     throw new Error('This username is already being used')
    }
    delete dbInMemory.userByUsername[currentUser.username]
    dbInMemory.userByUsername[userProperties['username']] = userID
 }
 const updatedUser: DBUser = {...currentUser, ...userProperties}
 dbInMemory.users[userID] = updatedUser
 dbInMemory.profiles[updatedUser.username] = toProfile(updatedUser)
 return updatedUser
}
export const follow = (followerID: string) => async (followedUsername: string) => {
  const profile = dbInMemory.profiles[followedUsername]
  if (!profile) throw new Error("User doesn't exists")

  const following = dbInMemory.following[followerID] ?? []
  // TODO: Check if the user is not trying to follow himself
  const currentUser = dbInMemory.users[followerID]
  if (!currentUser) throw new Error("Current user doesn't exists")
  if (currentUser.username === followedUsername) throw new Error("You can't follow yourself")

  const isFollow = following.findIndex(followingUsername => followingUsername === followedUsername)
  if (isFollow === -1){
    following.push(followedUsername)
    dbInMemory.following[followerID] = following 
    console.log(dbInMemory)
    return {...profile, following: true}
  }
  throw new Error('You already follow this user')
}

export const unfollow = (unfollowerID: string) => async (unfollowedUsername: string) => {
  const profile = dbInMemory.profiles[unfollowedUsername]
  if (!profile) throw new Error("User doesn't exists")

  const following = dbInMemory.following[unfollowerID] ?? []
  // TODO: Check if the user is not trying to follow himself
  const currentUser = dbInMemory.users[unfollowerID]
  if (!currentUser) throw new Error("Current user doesn't exists")
  if (currentUser.username === unfollowedUsername) throw new Error("You can't unfollow yourself")

  const isFollow = following.findIndex(followingUsername => followingUsername === unfollowedUsername)
  if (isFollow !== -1){
    if (following.length === 1) {
      dbInMemory.following[unfollowerID] = [] 
    } else {
      delete following[isFollow]
      dbInMemory.following[unfollowerID] = following 
    }
    console.log(dbInMemory)
    return {...profile, following: false}
  }
  throw new Error('You already unfollow this user')
}