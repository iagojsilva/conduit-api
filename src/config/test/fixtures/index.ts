import { Email } from "@/core/types/scalar";
import * as TE from "fp-ts/TaskEither";
import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/function";

export const unsafeEmail = (value: string): Email => value as any;

type Callback = (value: unknown) => unknown;

type MapAllTE = (
  fn: Callback
) => (data: TE.TaskEither<unknown, unknown>) => TE.TaskEither<unknown, unknown>;

export const mapAllTE: MapAllTE = (fn) => (data) =>
  pipe(data, TE.map(fn), TE.mapLeft(fn));

type MapAllE = (
  fn: Callback
) => (data: E.Either<unknown, unknown>) => E.Either<unknown, unknown>;

export const mapAllE: MapAllE = (fn) => (data) =>
  pipe(data, E.map(fn), E.mapLeft(fn));
