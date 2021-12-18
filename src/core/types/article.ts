import { profileCodec } from "@/core/types/profile";
import { tagCodec } from "@/core/types/tag";
import * as t from "io-ts";
import { positiveCodec } from "@/core/types/scalar";
import { withMessage } from "io-ts-types";

const articleCodecRequired = t.type({
  slug: t.string,
  title: t.string,
  description: t.string,
  body: t.string,
  tagList: withMessage(t.array(t.string), () => "Invalid tagList"),
  createdAt: t.string,
  updatedAt: t.string,
  favorited: t.boolean,
  favoritesCount: t.number,
});

const articleCodecOptional = t.partial({
  author: profileCodec,
});

const articleCodec = t.intersection([
  articleCodecRequired,
  articleCodecOptional,
]);

export type Article = t.TypeOf<typeof articleCodec>;

export const articlesCodec = t.type({
  article: t.array(articleCodec),
  articlesCount: positiveCodec,
});

const creatableArticleRequired = t.type({
  title: withMessage(t.string, () => "Invalid title"),
  description: withMessage(t.string, () => "Invalid description"),
  body: withMessage(t.string, () => "Invalid body"),
});

const creatableArticleOptional = t.partial({
  tagList: t.array(tagCodec),
});

export const creatableArticleCodec = t.intersection([
  creatableArticleRequired,
  creatableArticleOptional,
]);

export type CreatableArticle = t.TypeOf<typeof creatableArticleCodec>;

export type Articles = t.TypeOf<typeof articlesCodec>;
