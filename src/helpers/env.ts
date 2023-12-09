import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/function";
import { failure } from "io-ts/lib/PathReporter";
import { withMessage, NonEmptyString } from "io-ts-types";

export const env = (key: string) => {
  const envCodec = withMessage(
    NonEmptyString,
    () => `You must set the var env ${key}`
  );
  return pipe(
    process.env[key],
    envCodec.decode,
    E.fold(
      (errors) => {
        throw new Error(failure(errors).join(":::"));
      },
      (value) => value
    )
  );
};
