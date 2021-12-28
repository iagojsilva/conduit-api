import { passowordCodec } from './password'
import * as TE from 'fp-ts/TaskEither'
import { pipe } from 'fp-ts/function'
import { getMessageError, mapAll } from '@/config/test/fixtures'

it('Should accept password greater than or equal 8 characters', () => {
  const password = '12345678'
  return pipe(
    password,
    passowordCodec.decode,
    TE.fromEither,
    mapAll((result) => expect(result).toBe(password)),
  )()
})

it('Should not accept password less than 8 characters', () => {
  const password = '1234567'
  return pipe(
    password,
    passowordCodec.decode,
    TE.fromEither,
    mapAll((errors) =>
      expect(getMessageError(errors)).toBe(
        'Password should be at least 8 characters.',
      ),
    ),
  )()
})
