import { pipe } from "fp-ts/function";
import { CreatableArticle } from "@/core/types/article";
import { OutsideArticleRegister, registerArticle } from "./register-article";
import { mapAll, unsafe } from "@/config/test/fixtures";

const data: CreatableArticle = {
  title: "article-title",
  description: "article-description",
  body: "article-body",
};

const dataWithTags: CreatableArticle = {
  title: "article-title 2",
  description: "article-description 2",
  body: "article-body 2",
  tagList: [unsafe("tag1"), unsafe("tag1")],
};

const dataWithInvalidTags: CreatableArticle = {
  title: "article-title 3",
  description: "article-description 3",
  body: "article-body 3",
  tagList: [unsafe("Tag1"), unsafe("3ag1")],
};

const dataWithInvalidTitle: CreatableArticle = {
  title: unsafe(1),
  description: "article-description 3",
  body: "article-body 3",
};

const registerOk: OutsideArticleRegister<string> = async (
  data: CreatableArticle
) => {
  return `Article ${data.title} successfully created!`;
};

const registerFail: OutsideArticleRegister<never> = async () => {
  throw new Error("External Error");
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

it("Should not create an article if outsideRegister throws an error", () => {
  return pipe(
    data,
    registerArticle(registerFail),
    mapAll((error) => expect(error).toEqual(new Error(`External Error`)))
  )();
});

it("Should create an article with valid tags", () => {
  return pipe(
    dataWithTags,
    registerArticle(registerOk),
    mapAll((result) =>
      expect(result).toEqual(
        `Article ${dataWithTags.title} successfully created!`
      )
    )
  )();
});

it("Should not create an article with invalid tags", () => {
  return pipe(
    dataWithInvalidTags,
    registerArticle(registerOk),
    mapAll((result) =>
      expect(result).toEqual(
        new Error(
          `Invalid slug. Please, use alphanumeric characters, dash and/or numbers.:::Invalid slug. Please, use alphanumeric characters, dash and/or numbers.`
        )
      )
    )
  )();
});

it("Should not create an article with invalid title", () => {
  return pipe(
    dataWithInvalidTitle,
    registerArticle(registerOk),
    mapAll((result) => expect(result).toEqual(new Error(`Invalid title`)))
  )();
});
