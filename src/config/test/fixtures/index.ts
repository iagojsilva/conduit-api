import { Email, Password, Slug } from "@/core/types/scalar";
import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";

type Unsafe<T, P> = (value: T) => P;
export const unsafeString: Unsafe<unknown, string> = (value) => value as any;
export const unsafeEmail: Unsafe<string, Email> = (value) => value as any;
export const unsafeSlug: Unsafe<string, Slug> = (value: string): Slug =>
  value as any;
export const unsafePassword: Unsafe<string, Password> = (
  value: string
): Password => value as any;

type Callback = (value: unknown) => unknown;

type MapAllTE = (
  fn: Callback
) => (data: TE.TaskEither<unknown, unknown>) => TE.TaskEither<unknown, unknown>;

export const mapAll: MapAllTE = (fn) => (data) =>
  pipe(data, TE.map(fn), TE.mapLeft(fn));

export const getMessageError = (errors: unknown) =>
  Array.isArray(errors) ? errors[0]!.message : "";
