import * as t from "io-ts";
import { slugCodec, urlCodec } from "@/core/types";
import { UserOutput } from "../user/types";

export const profileCodec = t.type({
  username: slugCodec,
  bio: t.string,
  image: urlCodec,
  following: t.boolean,
});

export type Profile = t.TypeOf<typeof profileCodec>;
export type ProfileOutput = t.OutputOf<typeof profileCodec>;

export const toProfile = (user: UserOutput): ProfileOutput => {
  const {username, bio, image, ...rest} = user
  return {
    username,
    bio: bio ?? '',
    image: image ?? '',
    following: false
  }
}