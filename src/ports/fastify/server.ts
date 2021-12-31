import { env } from "@/helpers";
import fastify from "fastify";
import { pipe } from "fp-ts/lib/function";
import * as TE from 'fp-ts/TaskEither'
import { CreatableUser } from "@/core/user/types";
import { createUser } from "../adapters/http/modules/user";

const app = fastify({logger: true})

const PORT = env("PORT");

type APIUser = {
  Body: {
    user: CreatableUser
  }
}

app.post<APIUser>("/api/user", async (req, reply) => {
 return pipe(
    req.body.user,
    createUser,
    TE.map((result) => reply.send(result)),
    TE.mapLeft((error) =>
      reply.status(422).send(error)
    )
  )();
})



export const start = async () => {
  try {
    await app.listen(PORT)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

