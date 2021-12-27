import { pipe } from "fp-ts/function";
import { CreatableComment } from "@/core/types/comment";
import {
  OutsideAddComentToAnArticle,
  addComentToAnArticle,
} from "./create-comment";
import { mapAll, unsafe } from "@/config/test/fixtures";

const data: CreatableComment = {
  authorID: unsafe("8ee61555-b836-4ccc-8b14-b153f8cebc7b"),
  articleSlug: unsafe("valid-slug"),
  body: unsafe("Add an comment to an article"),
};

const dataWithInvalidBody: CreatableComment = {
  authorID: unsafe("8ee61555-b836-4ccc-8b14-b153f8cebc7b"),
  articleSlug: unsafe("valid-slug"),
  body: unsafe(""),
};

const dataWithInvalidAuthorID: CreatableComment = {
  authorID: unsafe(""),
  articleSlug: unsafe("valid-slug"),
  body: unsafe("My valid comment"),
};

const dataWithInvalidArticleSlug: CreatableComment = {
  authorID: unsafe("8ee61555-b836-4ccc-8b14-b153f8cebc7b"),
  articleSlug: unsafe(""),
  body: unsafe("My valid comment"),
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
    dataWithInvalidBody,
    addComentToAnArticle(registerOk),
    mapAll((result) =>
      expect(result).toEqual(
        new Error("The body of the comment must not be a empty string")
      )
    )
  )();
});

it("Should not accept an invalid authorID", async () => {
  return pipe(
    dataWithInvalidAuthorID,
    addComentToAnArticle(registerOk),
    mapAll((result) => expect(result).toEqual(new Error("Invalid AuthorID")))
  )();
});

it("Should not accept an invalid article slug", async () => {
  return pipe(
    dataWithInvalidArticleSlug,
    addComentToAnArticle(registerOk),
    mapAll((result) =>
      expect(result).toEqual(
        new Error(
          "Invalid slug. Please, use alphanumeric characters, dash and/or numbers."
        )
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
