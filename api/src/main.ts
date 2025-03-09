import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const port = process.env.API_PORT ?? 3000;
  await app.listen(port);

  const serverUrl = `http://localhost:${port}`;
  console.log(`🚀 API is running on: ${serverUrl}`);

  // If behind a proxy, log Heroku's provided hostname
  if (process.env.HEROKU_APP_NAME) {
    console.log(`🌍 Possible external URL: https://${process.env.HEROKU_APP_NAME}.herokuapp.com`);
  }
}
bootstrap();
