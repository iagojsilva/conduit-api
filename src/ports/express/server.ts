import { registerUserAdapter } from "@/core/user/use-cases/user-register-adapter";
import { pipe } from "fp-ts/function";
import * as TE from "fp-ts/TaskEither";
import * as E from "fp-ts/Either";
import { createArticleAdapter } from "@/core/article/use-cases/register-article-adapter";
import express, {
  NextFunction,
  Request as ExpressRequest,
  Response,
} from "express";

import {
  createUserInDBAdapter,
  createArticleInDBAdapter,
  addCommentToArticleInDB,
  login,
} from "@/ports/adapters/db";
import { env } from "@/helpers";
import { addCommentToAnArticleAdapter } from "@/core/article/use-cases/add-comment-to-an-article-adapter";
import { CustomJWTPayload, verifyJWT } from "@/ports/adapters/jwt";

type Request = ExpressRequest & { auth?: CustomJWTPayload };

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

app.post("/api/users/login", (req: Request, res: Response) => {
  return pipe(
    TE.tryCatch(() => login(req.body.user), E.toError),
    TE.map((result) => res.json(result)),
    TE.mapLeft((error) =>
      res.status(422).json(getErrorsMessages(error.message))
    )
  )();
});

const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header("authorization")?.replace("Bearer ", "")!;
    const payload = await verifyJWT(token);
    req.auth = payload;
    next();
  } catch {
    // If the user is not authorized
    res.status(401).json(getErrorsMessages("You need to be authorized"));
  }
};

// Private
app.post("/api/articles", auth, async (req: Request, res: Response) => {
  const payload = req.auth ?? {};

  const data = {
    ...req.body.article,
    authorID: payload["id"],
  };

  return pipe(
    data,
    createArticleAdapter(createArticleInDBAdapter),
    TE.map((result) => res.json(result)),
    TE.mapLeft((error) =>
      res.status(422).json(getErrorsMessages(error.message))
    )
  )();
});

app.post("/api/articles/:slug/comment", auth, (req: Request, res: Response) => {
  const payload = req.auth ?? {};

  const data = {
    ...req.body.comment,
    authorID: payload["id"],
    articleSlug: req.params["slug"],
  };

  console.log(data);

  return pipe(
    data,
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
