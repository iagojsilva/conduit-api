import { Profile } from "@/core/types/profile";
import { Tag } from '@/core/types/tag'

export type Article = {
  slug: string,
  title: string,
  description: string,
  body: string,
  tagList: Array<Tag>,
  createdAt: string,
  updatedAt: string,
  favorited: boolean
  favoritesCount: number,
  author: Profile
}

export type Articles = {
  articles: Array<Article>
  articlesCount: number
}
