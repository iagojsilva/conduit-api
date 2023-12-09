import { pipe } from "fp-ts/function";
import * as TE from "fp-ts/TaskEither";
import express, {
  NextFunction,
  Request as ExpressRequest,
  Response,
} from "express";
import { JWTPayload } from "@/ports/adapters/jwt";
import cors from "cors";
import * as user from "@/ports/adapters/http/modules/user";
import * as article from "@/ports/adapters/http/modules/article";
import { getErrorsMessages, getToken } from "@/ports/adapters/http/http";
import { id } from "./helpers";
import "dotenv/config";

type Request = ExpressRequest & { auth?: JWTPayload };

console.log({ env: process.env });

export const app = express();
app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.disable("x-powered-by").disable("etag");

app.get("/api/profiles/:username", async (req, res) => {
  const username = req.params.username;
  const payload = await getToken(req.headers.authorization);
  const requesterID = id(payload);
  const userProfile = user.getUserProfile(requesterID);
  return pipe(
    username,
    userProfile,
    TE.map((result) => res.json(result)),
    TE.mapLeft((error) => res.status(404).json(error))
  )();
});

app.post("/api/users", (req, res) => {
  return pipe(
    req.body.user,
    user.createUser,
    TE.map((result) => res.json(result)),
    TE.mapLeft((error) => res.status(422).json(error))
  )();
});

const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = await getToken(req.headers.authorization);
    req.auth = payload;
    next();
  } catch {
    // If the user is not authorized
    res.status(401).json(getErrorsMessages("You need to be authorized"));
  }
};
app.put("/api/user", auth, async (req: Request, res: Response) => {
  const payload = req.auth ?? {};
  const tokenInformation = {
    payload,
    authHeader: req.headers.authorization ?? "",
  };

  const data = req.body.user;

  return pipe(
    data,
    user.updateUser(tokenInformation),
    TE.map((result) => {
      res.json(result);
    }),
    TE.mapLeft((errors) => res.status(422).json(errors))
  )();
});
app.get("/api/user", auth, async (req: Request, res: Response) => {
  const payload = req.auth ?? {};
  return pipe(
    user.getCurrentUser({
      payload,
      authHeader: req.headers.authorization ?? "",
    }),
    TE.map((result) => {
      res.json(result);
    }),
    TE.mapLeft((errors) => res.status(404).json(errors))
  )();
});

app.post("/api/users/login", (req: Request, res: Response) => {
  return pipe(
    req.body.user,
    user.login,
    TE.map((result) => res.json(result)),
    TE.mapLeft((error) => res.status(422).json(error))
  )();
});

// Private
app.post("/api/articles", auth, async (req: Request, res: Response) => {
  const payload = req.auth ?? {};

  const data = {
    ...req.body.article,
    authorID: payload["id"],
  };

  return pipe(
    data,
    article.createArticle,
    TE.map((result) => res.json(result)),
    TE.mapLeft((error) => res.status(422).json(error))
  )();
});

app.post(
  "/api/articles/:slug/comments",
  auth,
  (req: Request, res: Response) => {
    const payload = req.auth ?? {};

    const data = {
      ...req.body.comment,
      authorID: payload["id"],
      articleSlug: req.params["slug"],
    };

    return pipe(
      data,
      article.addCommentToAnArticle,
      TE.map((result) => res.json(result)),
      TE.mapLeft((error) => res.status(422).json(error))
    )();
  }
);

app.delete(
  "/api/profiles/:username/follow",
  auth,
  (req: Request, res: Response) => {
    const payload = req.auth ?? {};
    const requesterID = id(payload);
    const username = req.params["username"] ?? "";
    return pipe(
      username,
      user.unfollow(requesterID),
      TE.map((result) => res.json(result)),
      TE.mapLeft((error) => res.status(404).json(error))
    )();
  }
);
app.post(
  "/api/profiles/:username/follow",
  auth,
  (req: Request, res: Response) => {
    const payload = req.auth ?? {};
    const requesterID = id(payload);
    return pipe(
      req.params["username"] ?? "",
      user.follow(requesterID),
      TE.map((result) => res.json(result)),
      TE.mapLeft((error) => res.status(404).json(error))
    )();
  }
);
