import { AuthorID } from "@/core/article/types";
import { JWTPayload } from "../adapters/jwt";

export const id = (payload: JWTPayload): AuthorID => payload["id"] as any