import { pipe } from "fp-ts/function";
import { CreatableArticle } from "@/core/types/article";
import { OutsideRegister, registerArticle } from "./register-article";
import { mapAll } from "@/config/test/fixtures";

const data: CreatableArticle = {
  title: "article-title",
  description: "article-description",
  body: "article-body",
};

const registerOk: OutsideRegister<string> = async (data: CreatableArticle) => {
  return `Article ${data.title} successfully created!`;
};

it("Should create an article properly", () => {
  return pipe(
    data,
    registerArticle(registerOk),
    mapAll((result) =>
      expect(result).toBe(`Article ${data.title} successfully created!`)
    )
  )();
});
