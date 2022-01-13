import {
  RegisterUser,
  registerUser as registerUserCore,
} from "./user-register";

export const registerUserAdapter: RegisterUser = (outsideRegister) => (data) =>
  registerUserCore(outsideRegister)(data);
