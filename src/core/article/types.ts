import { profileCodec } from "@/core/profile/types";
import { tagCodec } from "@/core/tag/types";
import * as t from "io-ts";
import { dateCodec, positiveCodec, slugCodec } from "@/core/types";
import { UUID, withMessage } from "io-ts-types";

const articleCodecRequired = t.type({
  slug: slugCodec,
  title: t.string,
  description: t.string,
  body: t.string,
  tagList: withMessage(t.array(slugCodec), () => "Invalid tagList"),
  createdAt: dateCodec,
  updatedAt: dateCodec,
  favorited: t.boolean,
  favoritesCount: positiveCodec,
});

const articleCodecOptional = t.partial({
  author: profileCodec,
});

const articleCodec = t.intersection([
  articleCodecRequired,
  articleCodecOptional,
]);

export type Article = t.TypeOf<typeof articleCodec>;
export type ArticleOutput = t.OutputOf<typeof articleCodec>;

export const articlesCodec = t.type({
  article: t.array(articleCodec),
  articlesCount: positiveCodec,
});

const authorIDCodec = withMessage(UUID, () => "Invalid authorID");
export type AuthorID = t.TypeOf<typeof authorIDCodec>;

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
