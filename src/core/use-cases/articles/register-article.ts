import { CreatableArticle } from '@/core/types/article'
import { pipe } from 'fp-ts/lib/function'
import * as TE from 'fp-ts/lib/TaskEither'
import * as E from 'fp-ts/Either'
import { validateArticle } from './validate-article'

export type OutsideArticleRegister<A> = (data: CreatableArticle) => Promise<A>;

export type RegisterArticle = <A>(
  outsideRegister: OutsideArticleRegister<A>
) => (data: CreatableArticle) => TE.TaskEither<Error, A>;

export const registerArticle: RegisterArticle = (outsideRegister) => (data) => {
  return pipe(
    data,
    validateArticle,
    TE.fromEither,
    TE.chain(() => TE.tryCatch(() => outsideRegister(data), E.toError)),
  )
}
