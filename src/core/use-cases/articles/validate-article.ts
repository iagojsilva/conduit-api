import { CreatableArticle, creatableArticleCodec } from '@/core/types/article'
import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'
import { failure } from 'io-ts/PathReporter'

type ValidateArticle = (
  data: CreatableArticle
) => E.Either<Error, CreatableArticle>;

export const validateArticle: ValidateArticle = (data) =>
  pipe(
    data,
    creatableArticleCodec.decode,
    E.mapLeft((errors) => new Error(failure(errors).join(':::'))),
  )
