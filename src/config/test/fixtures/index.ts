import * as TE from 'fp-ts/TaskEither'
import { pipe } from 'fp-ts/function'
export const unsafe = <T>(value: unknown): T => {
  return value as any
}

type Callback = (value: unknown) => unknown;

type MapAllTE = (
  fn: Callback
) => (data: TE.TaskEither<unknown, unknown>) => TE.TaskEither<unknown, unknown>;

export const mapAll: MapAllTE = (fn) => (data) =>
  pipe(data, TE.map(fn), TE.mapLeft(fn))

export const getMessageError = (errors: unknown) =>
  Array.isArray(errors) ? errors[0]!.message : ''
