import { profileCodec } from "@/core/types/profile";
import * as t from "io-ts";
import { dateCodec } from "@/core/types/scalar";

export const commentCodec = t.type({
  id: t.number,
  createdAt: dateCodec,
  updatedAt: dateCodec,
  body: t.string,
  author: profileCodec,
});

export type Comment = t.TypeOf<typeof commentCodec>;
