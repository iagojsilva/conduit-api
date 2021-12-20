import * as t from "io-ts";
import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/function";
import { failure } from "io-ts/lib/PathReporter";
import { withMessage } from "io-ts-types";

type LengthBrand = {
  readonly isNonEmptyString: unique symbol;
};

const isNonEmptyStringCodec = t.brand(
  t.string,
  (value): value is t.Branded<string, LengthBrand> => isNonEmptyString(value),
  "isNonEmptyString"
);

const isNonEmptyString = (value: unknown) =>
  typeof value === "string" && value.length > 0;

export const env = (key: string) => {
  const envCodec = withMessage(
    isNonEmptyStringCodec,
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
