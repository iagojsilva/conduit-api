import { dbInMemory } from "../db"

export const unfollowOp = (unfollowerID: string) => async (unfollowedUsername: string) => {
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
