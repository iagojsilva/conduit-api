import { database as dbOps } from "./db";

export const createUserInDBAdapter = dbOps.createUserInDB
export const login = dbOps.login
export const createArticleInDBAdapter = dbOps.createArticleInDB
export const addCommentToArticleInDB = dbOps.addCommentToArticleInDB
export const getCurrentUserAdapter = dbOps.getCurrentUser
export const updateUserAdapter = dbOps.updateUser
export const getUserProfileAdapter = dbOps.getUserProfile
export const follow = dbOps.follow
export const unfollow = dbOps.unfollow