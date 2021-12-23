import { User } from "@/core/types/user";
import {
  RegisterUser,
  registerUser as registerUserCore,
} from "@/core/use-cases/user/user-register";

export type OutsideRegisterUser = (data: User) => Promise<{ user: User }>;

export const registerUserAdapter: RegisterUser = (outsideRegister) => (data) =>
  registerUserCore(outsideRegister)(data);
