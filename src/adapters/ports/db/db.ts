import { OutsideRegisterArticleType } from "@/adapters/use-cases/article/register-article-adapter";
import { OutsideRegisterType } from "@/adapters/use-cases/user/user-register-adapter";
import { outsideArticleRegister, outsideRegister } from "@/ports/db-in-memory";

export const userRegister: OutsideRegisterType = (data) =>
  outsideRegister(data);

export const createArticleDBAdapter: OutsideRegisterArticleType = (data) =>
  outsideArticleRegister(data);
