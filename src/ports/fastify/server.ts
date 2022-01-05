import { env } from "@/helpers";
import fastify, {
  DoneFuncWithErrOrRes,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import { pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/TaskEither";
import { CreatableUser, LoginUser } from "@/core/user/types";
import * as user from "../adapters/http/modules/user";
import { JWTPayload, verifyJWT } from "@/ports/adapters/jwt";
import { getErrorsMessages } from "../adapters/http/http";
import { AuthorID, CreatableArticle } from "@/core/article/types";
import * as article from "@/ports/adapters/http/modules/article";
import { CreatableComment } from "@/core/comment/types";
import { Slug } from "@/core/types";

const app = fastify();

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
const auth = async (
  req: FastifyRequest<PayloadHeaders>,
  reply: FastifyReply,
  done: DoneFuncWithErrOrRes
) => {
  try {
    const token = req.headers.authorization?.replace("Token ", "")!;
    const payload = await verifyJWT(token);
    req.headers.payload = payload;
    done();
  } catch {
    // If the user is not authorized
    reply.status(401).send(getErrorsMessages("You need to be authorized"));
  }
};

const authOptions = {
  preValidation: auth,
};
app.post<APIUser>("/api/users", async (req, reply) => {
  return pipe(
    req.body.user,
    user.createUser,
    TE.map((result) => reply.send(result)),
    TE.mapLeft((error) => reply.status(422).send(error))
  )();
});

app.get("/api/user", authOptions, async (req, reply) => {
  const token = req.headers.authorization?.replace("Token ", "")!;
  const userID = req.headers.payload["id"]! as AuthorID;
  const data = { userID, token };
  return pipe(
    data,
    user.getCurrentUser,
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
app.post<UsersLogin>("/api/users/login", async (req, reply) => {
  return pipe(
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
app.post<ApiArticles>("/api/articles", authOptions, async (req, reply) => {
  // TODO: There is no way id be undefined here beaucase the auth function is setting the payload
  const authorID = req.headers.payload["id"]!;
  const data = {
    ...req.body.article,
    authorID: authorID as AuthorID,
  };

  return pipe(
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
  async (req, reply) => {
    // TODO: There is no way id be undefined here beaucase the auth function is setting the payload
    const authorID = req.headers.payload["id"]!;
    const data = {
      ...req.body.comment,
      authorID: authorID as AuthorID,
      articleSlug: req.params.slug,
    };

    return pipe(
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
