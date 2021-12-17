import {
  emailCodec,
  slugCodec,
  urlCodec,
  passowordCodec,
} from "@/core/types/scalar";
import * as t from "io-ts";

const userCodecRequired = t.type({
  email: emailCodec,
  username: slugCodec,
});

const userCodecPartial = t.partial({
  token: t.string,
  bio: t.string,
  image: urlCodec,
});

export const userCodec = t.intersection([userCodecRequired, userCodecPartial]);

export type User = t.TypeOf<typeof userCodec>;

export const creatableUserCodec = t.type({
  username: slugCodec,
  email: emailCodec,
  password: passowordCodec,
});

export type CreatableUser = t.TypeOf<typeof creatableUserCodec>;
