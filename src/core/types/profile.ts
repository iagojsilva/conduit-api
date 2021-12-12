import * as t from "io-ts";
import { urlCodec } from "./scalar";

export const profileCodec = t.type({
  username: t.string,
  bio: t.string,
  image: urlCodec,
  following: t.boolean,
});

export type Profile = t.TypeOf<typeof profileCodec>;
