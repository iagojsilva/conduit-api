import * as t from "io-ts";
import { emailCodec, slugCodec, urlCodec, passwordCodec } from "../types";

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
export type UserOutput = t.OutputOf<typeof userCodec>;

export const creatableUserCodec = t.type({
  username: slugCodec,
  email: emailCodec,
  password: passwordCodec,
});

export type CreatableUser = t.TypeOf<typeof creatableUserCodec>;
export const updatableUserCodec = t.partial({
  email: emailCodec,
  username: slugCodec,
  password: passwordCodec,
  bio: t.string,
  image: urlCodec,
})

export type UpdatableUser = t.TypeOf<typeof updatableUserCodec>

export const loginUserCodec = t.type({
  email: emailCodec,
  password: passwordCodec,
});

export type LoginUser = t.TypeOf<typeof loginUserCodec>;
