import { OutsideRegisterType } from "@/adapters/use-cases/user/user-register-adapter";
import { outsideRegister } from "@/ports/db-in-memory";

export const userRegister: OutsideRegisterType = (data) => {
  return outsideRegister(data);
};
