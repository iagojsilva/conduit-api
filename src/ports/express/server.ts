import { registerUserAdapter } from "@/adapters/use-cases/user/user-register-adapter";
import { pipe } from "fp-ts/function";
import * as TE from "fp-ts/TaskEither";
import { createArticleAdapter } from "@/adapters/use-cases/article/register-article-adapter";
import express from "express";
import {
  createUserInDBAdapter,
  createArticleInDBAdapter,
  addCommentToArticleInDB,
} from "@/adapters/ports/db";
import { env } from "@/helpers";
import { addCommentToAnArticleAdapter } from "@/adapters/use-cases/article/add-comment-to-an-article-adapter";
import { verifyJWT } from "@/adapters/ports/jwt";

const PORT = env("PORT");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.disable("x-powered-by").disable("etag");

// Public
app.post("/api/user", (req, res) => {
  return pipe(
    req.body.user,
    registerUserAdapter(createUserInDBAdapter),
    TE.map((result) => res.json(result)),
    TE.mapLeft((error) =>
      res.status(422).json(getErrorsMessages(error.message))
    )
  )();
});

/* const auth = (req: Request, res: Response, next: NextFunction) => {
  next();
}; */

//Private
app.post("/api/articles", async (req, res) => {
  const token = req.header("authorization")?.replace("Bearer ", "")!;
  const payload = await verifyJWT(token);

  const data = {
    ...req.body.article,
    authorID: payload["id"],
  };

  console.log({ payload });
  return pipe(
    data,
    createArticleAdapter(createArticleInDBAdapter),
    TE.map((result) => res.json(result)),
    TE.mapLeft((error) =>
      res.status(422).json(getErrorsMessages(error.message))
    )
  )();
});

app.post("/api/articles/:slug/comment", (req, res) => {
  return pipe(
    req.body.comment,
    addCommentToAnArticleAdapter(addCommentToArticleInDB),
    TE.map((result) => res.json(result)),
    TE.mapLeft((error) =>
      res.status(422).json(getErrorsMessages(error.message))
    )
  )();
});

app.listen(PORT, () => {
  console.log(`Server listing on port ${PORT}`);
});

const getErrorsMessages = (errors: string) => {
  return {
    errors: {
      body: errors.split(":::"),
    },
  };
};
