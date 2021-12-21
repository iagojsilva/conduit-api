import { CreatableUser } from "@/core/types/user";
import { OutsideRegister, registerUser } from "./user-register";
import { pipe } from "fp-ts/function";
import { mapAll, unsafe } from "@/config/test/fixtures";

const registerOk: OutsideRegister<string> = async (data) => {
  return `User ${data.username} successfuly created`;
};

const registerFail: OutsideRegister<never> = async (_data) => {
  throw new Error(`External error`);
};

const data: CreatableUser = {
  username: unsafe("username-test"),
  email: unsafe("email-test@test.com"),
  password: unsafe("password-test"),
};

const dataWithInvalidUsername: CreatableUser = {
  username: unsafe("u"),
  email: unsafe("email-test@test.com"),
  password: unsafe("password-test"),
};

const dataWithInvalidEmailAndPassword: CreatableUser = {
  username: unsafe("valid-username"),
  email: unsafe("invalid.email"),
  password: unsafe("wrongp"),
};

it("Should create a user with sucess", async () => {
  return pipe(
    data,
    registerUser(registerOk),
    mapAll((result) =>
      expect(result).toBe(`User ${data.username} successfuly created`)
    )
  )();
});

it("Should not create user with an invalid username", () => {
  return pipe(
    dataWithInvalidUsername,
    registerUser(registerOk),
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
    registerUser(registerOk),
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
    registerUser(registerFail),
    mapAll((error) => expect(error).toEqual(new Error("External error")))
  )();
});
