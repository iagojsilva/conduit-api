import { CreatableUser } from "@/core/types/user";
import { OutsideRegister, register } from "./register";
import { pipe } from "fp-ts/function";
import {
  mapAll,
  unsafeEmail,
  unsafeSlug,
  unsafePassword,
} from "@/config/test/fixtures";

const registerOk: OutsideRegister<string> = async (data) => {
  return `User ${data.username} successfuly created`;
};

const registerFail: OutsideRegister<never> = async (_data) => {
  throw new Error(`External error`);
};

const data: CreatableUser = {
  username: unsafeSlug("username-test"),
  email: unsafeEmail("email-test@test.com"),
  password: unsafePassword("password-test"),
};

const dataWithInvalidUsername: CreatableUser = {
  username: unsafeSlug("u"),
  email: unsafeEmail("email-test@test.com"),
  password: unsafePassword("password-test"),
};

const dataWithInvalidEmailAndPassword: CreatableUser = {
  username: unsafeSlug("valid-username"),
  email: unsafeEmail("invalid.email"),
  password: unsafePassword("wrongp"),
};

it("Should create a user with sucess", async () => {
  return pipe(
    data,
    register(registerOk),
    mapAll((result) =>
      expect(result).toBe(`User ${data.username} successfuly created`)
    )
  )();
});

it("Should not create user with an invalid username", () => {
  return pipe(
    dataWithInvalidUsername,
    register(registerOk),
    mapAll((error) =>
      expect(error).toEqual(
        new Error(
          "Invalid slug. Please, use alphanumeric characters, dash and/or numbers."
        )
      )
    )
  )();
});

it("Should not create user with invalid email and password", () => {
  return pipe(
    dataWithInvalidEmailAndPassword,
    register(registerOk),
    mapAll((error) =>
      expect(error).toEqual(
        new Error("Invalid Email.:::Password should be at least 8 characters.")
      )
    )
  )();
});

it("Should return a Left if register function throws an error", () => {
  return pipe(
    data,
    register(registerFail),
    mapAll((error) => expect(error).toEqual(new Error("External error")))
  )();
});
