import { profileCodec } from "@/core/profile/types";
import * as t from "io-ts";
import { dateCodec, slugCodec } from "@/core/types";
import { NonEmptyString, UUID, withMessage } from "io-ts-types";

export const commentCodecRequired = t.type({
  id: t.number,
  createdAt: dateCodec,
  updatedAt: dateCodec,
  body: t.string,
});

const commentCodecOptional = t.partial({
  author: profileCodec,
});

export const commentCodec = t.intersection([
  commentCodecRequired,
  commentCodecOptional,
]);

export type Comment = t.TypeOf<typeof commentCodec>;
export type CommentOutput = t.OutputOf<typeof commentCodec>;

export const creatableCommentCodec = t.type({
  authorID: withMessage(UUID, () => "Invalid AuthorID"),
  articleSlug: slugCodec,
  body: withMessage(
    NonEmptyString,
    () => "The body of the comment must not be a empty string"
  ),
});

export type CreatableComment = t.TypeOf<typeof creatableCommentCodec>;
