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
import { CreatableArticle } from "@/core/article/types";
import * as article from "@/ports/adapters/http/modules/article";
import { IncomingMessage, Server } from "http";

const app = fastify({ logger: true });

const PORT = env("PORT");

type APIUser = {
  Body: {
    user: CreatableUser;
  };
};

app.post<APIUser>("/api/user", async (req, reply) => {
  return pipe(
    req.body.user,
    user.createUser,
    TE.map((result) => reply.send(result)),
    TE.mapLeft((error) => reply.status(422).send(error))
  )();
});

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

const auth = async (
  req: FastifyRequest<ApiArticles, Server, IncomingMessage, unknown>,
  reply: FastifyReply,
  done: DoneFuncWithErrOrRes
) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "")!;
    const payload = await verifyJWT(token);
    req.headers.payload = payload;
    done();
  } catch {
    // If the user is not authorized
    reply.status(401).send(getErrorsMessages("You need to be authorized"));
  }
};

const articleOptions = {
  preValidation: auth,
};

export type ApiArticles = {
  Body: {
    article: CreatableArticle;
  };
  Headers: {
    payload: JWTPayload;
  };
};

app.post<ApiArticles>("/api/articles", articleOptions, async (req, reply) => {
  const authorID = req.headers.payload["id"];

  const data = {
    ...req.body.article,
    authorID: authorID,
  };

  return pipe(
    data,
    article.createArticle,
    TE.map((result) => reply.send(result)),
    TE.mapLeft((error) => reply.status(422).send(error))
  )();
});

export const start = async () => {
  try {
    await app.listen(PORT);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};
