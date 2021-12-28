import { urlCodec } from './url'
import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'

it('Should return right when we pass a valid url', () => {
  const validUrl = 'https://url.com'
  const either = pipe(validUrl, urlCodec.decode)

  expect(E.isRight(either)).toBeTruthy()
})

it('Should return left when we pass a invalid url', () => {
  const invalidUrl = 'invalid-url'
  const either = pipe(invalidUrl, urlCodec.decode)

  expect(E.isLeft(either)).toBeTruthy()
})
