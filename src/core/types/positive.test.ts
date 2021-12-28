import { positiveCodec } from './positive'
import * as TE from 'fp-ts/TaskEither'
import { pipe } from 'fp-ts/function'
import { getMessageError, mapAll } from '@/config/test/fixtures'

it('Should positive numbers', () => {
  const positive = 1
  return pipe(
    positive,
    positiveCodec.decode,
    TE.fromEither,
    mapAll((result) => expect(result).toBe(1)),
  )()
})

it('Should accept 0', () => {
  const positive = 0
  return pipe(
    positive,
    positiveCodec.decode,
    TE.fromEither,
    mapAll((result) => expect(result).toBe(0)),
  )()
})

it('Should not accept negative numbers', () => {
  const negative = -32
  return pipe(
    negative,
    positiveCodec.decode,
    TE.fromEither,
    mapAll((errors) =>
      expect(getMessageError(errors)).toBe('Only positive numbers are allowed.'),
    ),
  )()
})
