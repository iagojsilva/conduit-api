import "dotenv/config";

import { app } from "@/ports/adapters/http";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import "./config/module-alias";

async function bootstrap() {
  const nestApp = await NestFactory.create(AppModule);

  nestApp.setGlobalPrefix("/api");
  nestApp.use(app);

  await nestApp.listen(3000);
}
bootstrap();
