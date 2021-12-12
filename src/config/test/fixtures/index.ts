import { emailCodec } from "@/core/types/scalar";
import * as t from "io-ts";
import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";

export const unsafeEmail = (value: string): t.TypeOf<typeof emailCodec> =>
  value as any;

type Callback = (value: unknown) => unknown;

type MapAll = (
  fn: Callback
) => (data: TE.TaskEither<unknown, unknown>) => TE.TaskEither<unknown, unknown>;

export const mapAll: MapAll = (fn) => (data) =>
  pipe(data, TE.map(fn), TE.mapLeft(fn));
