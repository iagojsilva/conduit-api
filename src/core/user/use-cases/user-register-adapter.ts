import { UserOutput } from "@/core/user/types";
import {
  OutsideRegister,
  RegisterUser,
  registerUser as registerUserCore,
} from "./user-register";

export type OutsideRegisterUser = OutsideRegister<{ user: UserOutput }>;

export const registerUserAdapter: RegisterUser = (outsideRegister) => (data) =>
  registerUserCore(outsideRegister)(data);
