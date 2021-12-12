import { emailCodec } from "./email";
import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/function";

it("Should return right when we pass a valid email", () => {
  const validEmail = "jon@doe.com";
  const either = pipe(validEmail, emailCodec.decode);

  expect(E.isRight(either)).toBeTruthy();
});

it("Should return left when we pass a invalid email", () => {
  const invalidEmail = "jon@d";
  const either = pipe(invalidEmail, emailCodec.decode);

  expect(E.isLeft(either)).toBeTruthy();
});
