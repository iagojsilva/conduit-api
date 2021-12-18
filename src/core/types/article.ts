import { profileCodec } from "@/core/types/profile";
import { tagCodec } from "@/core/types/tag";
import * as t from "io-ts";
import { dateCodec, slugCodec, positiveCodec } from "@/core/types/scalar";

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
  articlesCount: positiveCodec,
});

const creatableArticleRequired = t.type({
  title: t.string,
  description: t.string,
  body: t.string,
});

const creatableArticleOptional = t.partial({
  tag: t.array(tagCodec),
});

export const creatableArticleCodec = t.intersection([
  creatableArticleRequired,
  creatableArticleOptional,
]);

export type CreatableArticle = t.TypeOf<typeof creatableArticleCodec>;

export type Articles = t.TypeOf<typeof articlesCodec>;
