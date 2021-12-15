import {
  emailCodec,
  slugCodec,
  urlCodec,
  passowordCodec,
} from "@/core/types/scalar";
import * as t from "io-ts";

export const userCodec = t.type({
  email: emailCodec,
  token: t.string,
  username: slugCodec,
  bio: t.string,
  image: urlCodec,
});

export type User = t.TypeOf<typeof userCodec>;

export const creatableUserCodec = t.type({
  username: slugCodec,
  email: emailCodec,
  password: passowordCodec,
});

export type CreatableUser = t.TypeOf<typeof creatableUserCodec>;
