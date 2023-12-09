import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";

@Module({
  imports: [ConfigModule.forRoot()],
  exports: [],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
