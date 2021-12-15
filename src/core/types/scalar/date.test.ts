import { dateCodec } from "./date";
import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/function";

it("Should return right when we pass a valid date", () => {
  const date = new Date().toISOString();
  const either = pipe(date, dateCodec.decode);

  expect(E.isRight(either)).toBeTruthy();
});

it("Should return left when we pass a invalid date", () => {
  const date = "10-12-2021";
  const either = pipe(date, dateCodec.decode);

  expect(E.left(either)).toBeTruthy();
});
