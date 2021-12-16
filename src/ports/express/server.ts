import {
  OutsideRegisterType,
  register,
} from "@/adapters/user/register-adapter";
import { pipe } from "fp-ts/function";
import * as TE from "fp-ts/TaskEither";

import express from "express";

const PORT = 3333;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const outsideRegister: OutsideRegisterType = async (data) => {
  return {
    success: true,
    data,
  };
};

app.post("/api/user", (req, res) => {
  return pipe(
    req.body.user,
    register(outsideRegister),
    TE.map((result) => res.json(result)),
    TE.mapLeft((error) => res.status(400).json(error.message))
  )();
});

app.listen(PORT, () => {
  console.log(`Server listing on port ${PORT}`);
});
