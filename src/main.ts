import * as compression from 'compression';
import helmet from 'helmet';
import { EnvironmentVariables } from '@config/index';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors();
  app.use(compression());
  app.use(helmet());

  const configService = app.get(ConfigService);
  const host = configService.get<string>(EnvironmentVariables.HOST);
  const port = configService.get<number>(EnvironmentVariables.PORT);
  await app.listen(port, () => {
    console.log(`Server is listening at ${host}:${port}`);
  });
}
bootstrap();
