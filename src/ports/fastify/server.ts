import { env } from "@/helpers";
import fastify, {
  DoneFuncWithErrOrRes,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import { pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/TaskEither";
import * as E from "fp-ts/Either";
import { CreatableUser, LoginUser } from "@/core/user/types";
import * as user from "../adapters/http/modules/user";
import { JWTPayload } from "@/ports/adapters/jwt";
import { getErrorsMessages, getToken } from "../adapters/http/http";
import { AuthorID, CreatableArticle } from "@/core/article/types";
import * as article from "@/ports/adapters/http/modules/article";
import { CreatableComment } from "@/core/comment/types";
import { Slug } from "@/core/types";

const app = fastify({ logger: true });

type PayloadHeaders = {
  Headers: {
    payload: JWTPayload;
  };
};
// Create one user
type APIUser = {
  Body: {
    user: CreatableUser;
  };
};

// Authetication by middleware
const auth = (
  req: FastifyRequest<PayloadHeaders>,
  reply: FastifyReply,
  done: DoneFuncWithErrOrRes
) => {
  pipe(
    TE.tryCatch(() => getToken(req.headers.authorization), E.toError),
    TE.map((payload) => {
      req.headers.payload = payload;
      done();
    }),
    TE.mapLeft(() => reply.status(401).send(getErrorsMessages("Unauthorized")))
  )();
};

const authOptions = {
  preValidation: auth,
};
app.post<APIUser>("/api/users", (req, reply) => {
  pipe(
    req.body.user,
    user.createUser,
    TE.map((result) => reply.send(result)),
    TE.mapLeft((error) => reply.status(422).send(error))
  )();
});

app.get("/api/user", authOptions, (req, reply) => {
  const payload = req.headers.payload
  pipe(
    user.getCurrentUser(
      {payload, authHeader: req.headers.authorization!}
    ),
    TE.map((result) => {
      reply.send(result);
    }),
    TE.mapLeft((errors) => reply.status(404).send(errors))
  )();
});

// Login one user
type UsersLogin = {
  Body: {
    user: LoginUser;
  };
};
app.post<UsersLogin>("/api/users/login", (req, reply) => {
  pipe(
    req.body.user,
    user.login,
    TE.map((result) => reply.send(result)),
    TE.mapLeft((error) => reply.status(422).send(error))
  )();
});

export type ApiArticles = PayloadHeaders & {
  Body: {
    article: CreatableArticle;
  };
};
app.post<ApiArticles>("/api/articles", authOptions, (req, reply) => {
  // TODO: There is no way id be undefined here beaucase the auth function is setting the payload
  const authorID = req.headers.payload["id"]!;
  const data = {
    ...req.body.article,
    authorID: authorID as AuthorID,
  };

  pipe(
    data,
    article.createArticle,
    TE.map((result) => reply.send(result)),
    TE.mapLeft((error) => reply.status(422).send(error))
  )();
});
// Add comment to one article
type ApiComment = PayloadHeaders & {
  Body: {
    comment: CreatableComment;
  };
  Params: {
    slug: Slug;
  };
};
app.post<ApiComment>(
  "/api/articles/:slug/comments",
  authOptions,
  (req, reply) => {
    // TODO: There is no way id be undefined here beaucase the auth function is setting the payload
    const authorID = req.headers.payload["id"]!;
    const data = {
      ...req.body.comment,
      authorID: authorID as AuthorID,
      articleSlug: req.params.slug,
    };

    pipe(
      data,
      article.addCommentToAnArticle,
      TE.map((result) => reply.send(result)),
      TE.mapLeft((error) => reply.status(422).send(error))
    )();
  }
);
// Init the application
export const start = async () => {
  try {
    const PORT = env("PORT");
    await app.listen(PORT);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};
