import { profileCodec } from "@/core/types/profile";
import { tagCodec } from "@/core/types/tag";
import * as t from "io-ts";
import { dateCodec, slugCodec } from "@/core/types/scalar";

export const articleCodec = t.type({
  slug: slugCodec,
  title: t.string,
  description: t.string,
  body: t.string,
  tagList: t.array(tagCodec),
  createdAt: dateCodec,
  updatedAt: dateCodec,
  favorited: t.boolean,
  favoritesCount: t.number,
  author: profileCodec,
});

export type Article = t.TypeOf<typeof articleCodec>;

export const articlesCodec = t.type({
  article: t.array(articleCodec),
  articlesCount: t.number,
});

export type Articles = t.TypeOf<typeof articlesCodec>;
