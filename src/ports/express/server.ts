import { register } from "@/adapters/use-cases/user/register-adapter";
import { pipe } from "fp-ts/function";
import * as TE from "fp-ts/TaskEither";

import express from "express";
import { userRegister } from "@/adapters/ports/db";

const PORT = process.env.PORT;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/api/user", (req, res) => {
  return pipe(
    req.body.user,
    register(userRegister),
    TE.map((result) => res.json(result)),
    TE.mapLeft((error) => res.status(400).json(error.message))
  )();
});

app.listen(PORT, () => {
  console.log(`Server listing on port ${PORT}`);
});
