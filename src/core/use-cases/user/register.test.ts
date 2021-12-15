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

const data: CreatableUser = {
  username: unsafeSlug("username-test"),
  email: unsafeEmail("email-test@test.com"),
  password: unsafePassword("password-test"),
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
