import { flow, pipe } from "fp-ts/lib/function";
import { dbInMemory } from "../db";
import {
  following,
  profiles,
  users,
  isFollowingHimself,
  unfollowF,
  saveFollowing,
} from "../fp-helpers";

export const unfollowOp =
  (unfollowerID: string) => async (unfollowedUsername: string) => {
    const profile = dbInMemory.profiles[unfollowedUsername];
    if (!profile) throw new Error("User doesn't exists");

    const following = dbInMemory.following[unfollowerID] ?? [];
    const currentUser = dbInMemory.users[unfollowerID];
    if (!currentUser) throw new Error("Current user doesn't exists");
    // unfollowing yourself, not allowed
    if (currentUser.username === unfollowedUsername)
      throw new Error("You can't unfollow yourself");

    const isFollow = following.findIndex(
      (followingUsername) => followingUsername === unfollowedUsername
    );
    if (isFollow !== -1) {
      if (following.length === 1) {
        dbInMemory.following[unfollowerID] = [];
      } else {
        delete following[isFollow];
        dbInMemory.following[unfollowerID] = following;
      }
      console.log(dbInMemory);
      return { ...profile, following: false };
    }
    throw new Error("You already unfollow this user");
  };
export const unfollowOpFP =
  (unfollowerID: string) => async (unfollowedUsername: string) => {
    const profile = profiles(unfollowedUsername);
    const followingPeople = following(unfollowerID);
    const currentUser = users(unfollowerID);

    const save = saveFollowing(unfollowerID);
    const unfollowFlow = flow(isFollowingHimself, unfollowF, save);

    return pipe(
      { p: profile, following: followingPeople, u: currentUser },
      unfollowFlow,
      () => ({...profile, following: false}) 
    );
  };
