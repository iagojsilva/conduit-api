import { dbInMemory } from "../db"

export const followOp = (followerID: string) => async (usernameToFollow: string) => {
  const profile = dbInMemory.profiles[usernameToFollow]
  if (!profile) throw new Error("User doesn't exists")

  // Get current user's following people
  const following = dbInMemory.following[followerID] ?? []
  const currentUser = dbInMemory.users[followerID]
  if (!currentUser) throw new Error("Current user doesn't exists")

  if (currentUser.username === usernameToFollow) throw new Error("You can't follow yourself")

  const isFollow = following.findIndex(followingUsername => followingUsername === usernameToFollow)
  if (isFollow === -1){
    following.push(usernameToFollow)
    dbInMemory.following[followerID] = following 
    return {...profile, following: true}
  }
  throw new Error('You already follow this user')
}
