import { UserOutput } from "@/core/types/user";
import {
  OutsideRegister,
  RegisterUser,
  registerUser as registerUserCore,
} from "@/core/use-cases/user/user-register";

export type OutsideRegisterUser = OutsideRegister<{ user: UserOutput }>;

export const registerUserAdapter: RegisterUser = (outsideRegister) => (data) =>
  registerUserCore(outsideRegister)(data);
