import { pipe } from "fp-ts/function";
import { CreatableComment } from "@/core/types/comment";
import {
  OutsideAddComentToAnArticle,
  addComentToAnArticle,
} from "./create-comment";
import { mapAll, unsafe } from "@/config/test/fixtures";

const data: CreatableComment = {
  body: unsafe("Add an comment to an article"),
};

const dataFail: CreatableComment = {
  body: unsafe(""),
};

const registerOk: OutsideAddComentToAnArticle<string> = async (
  data: CreatableComment
) => {
  return `Comment created successfully: ${data.body}`;
};

const registerFail: OutsideAddComentToAnArticle<never> = async () => {
  throw new Error("External error!");
};

it("Should add an comment to an article properly", async () => {
  return pipe(
    data,
    addComentToAnArticle(registerOk),
    mapAll((result) =>
      expect(result).toBe(`Comment created successfully: ${data.body}`)
    )
  )();
});

it("Should not accept an empty string", async () => {
  return pipe(
    dataFail,
    addComentToAnArticle(registerOk),
    mapAll((result) =>
      expect(result).toEqual(
        new Error("The body of the comment must not be a empty string")
      )
    )
  )();
});

it("Should not create an article if outsideAddCommentToAnArticle function throws an error", async () => {
  return pipe(
    data,
    addComentToAnArticle(registerFail),
    mapAll((result) => expect(result).toEqual(new Error("External error!")))
  )();
});
