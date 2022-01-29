import { UpdatableUser } from "@/core/user/types";
import { OutsideUpdate, updateUser } from "./user-update";
import { pipe } from "fp-ts/function";
import { mapAll, unsafe } from "@/config/test/fixtures";
import { AuthorID } from "@/core/article/types"
const updateOk: OutsideUpdate<string> = (data) => async (_userID) => {
  return `User ${data.username} successfuly updated`;
};

const updateFail: OutsideUpdate<never> = (_data) => async (_userID) => {
  throw new Error("External error");
};

const userID = unsafe<AuthorID>('5adc72e9-b2ff-4158-92cf-acc28025bb05'); 

const data: UpdatableUser = {
  username: unsafe("username-test"),
  email: unsafe("email-test@test.com"),
  password: unsafe("password-test"),
};

const dataWithInvalidUsername: UpdatableUser = {
  username: unsafe("u"),
  email: unsafe("email-test@test.com"),
  password: unsafe("password-test"),
};

const dataWithInvalidEmailAndPassword: UpdatableUser = {
  username: unsafe("valid-username"),
  email: unsafe("invalid.email"),
  password: unsafe("wrongp"),
};

it("Should create a user with sucess", async () => {
  return pipe(
    userID,
    updateUser(updateOk)(data),
    mapAll((result) =>
      expect(result).toBe(`User ${data.username} successfuly updated`)
    )
  )();
});

it("Should not create user with an invalid username", () => {
  return pipe(
    userID,
    updateUser(updateOk)(dataWithInvalidUsername),
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
    userID,
    updateUser(updateOk)(dataWithInvalidEmailAndPassword),
    mapAll((error) =>
      expect(error).toEqual(
        new Error("Invalid Email.:::Password should be at least 8 characters.")
      )
    )
  )();
});

it("Should return a Left if update function throws an error", () => {
  return pipe(
    userID,
    updateUser(updateFail)(data),
    mapAll((error) => expect(error).toEqual(new Error("External error")))
  )();
});
