import { slugCodec } from './slug'
import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'

it('Should return right when we pass a valid slug', () => {
  const slug = 'valid-slug'
  const either = pipe(slug, slugCodec.decode)

  expect(E.isRight(either)).toBeTruthy()
})

it('Should return left when we pass a invalid slug', () => {
  const startsWithNumber = '3valid-slug'
  const endsWithDash = 'in'
  const lessThenThreeChar = '3invalid slug'

  const eitherStartsWithNumber = pipe(startsWithNumber, slugCodec.decode)
  const eitherEndsWithDash = pipe(endsWithDash, slugCodec.decode)
  const eitherLessThenThreeChar = pipe(lessThenThreeChar, slugCodec.decode)

  expect(E.isLeft(eitherLessThenThreeChar)).toBeTruthy()
  expect(E.isLeft(eitherStartsWithNumber)).toBeTruthy()
  expect(E.isLeft(eitherEndsWithDash)).toBeTruthy()
})
