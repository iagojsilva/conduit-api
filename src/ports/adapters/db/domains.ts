import { database as dbOps } from "./db";

export const createUserInDBAdapter = dbOps.createUserInDB
export const login = dbOps.login
export const createArticleInDBAdapter = dbOps.createArticleInDB
export const addCommentToArticleInDB = dbOps.addCommentToArticleInDB
export const getCurrentUserAdapter = dbOps.getCurrentUser
