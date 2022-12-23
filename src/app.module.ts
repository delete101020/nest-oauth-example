import { Environment } from '@common/enums';
import { AllExceptionsFilter } from '@common/filters';
import { TransformResponseInterceptor } from '@common/interceptors';
import { EnvironmentSchema, EnvironmentVariables } from '@config/index';
import { AuthModule } from '@modules/auth/auth.module';
import { UserModule } from '@modules/user/user.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProjectModule } from './modules/project/project.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || Environment.DEVELOPMENT}`,
      cache: true,
      validationSchema: EnvironmentSchema,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          uri: configService.get<string>(EnvironmentVariables.MONGODB_URI),
          useNewUrlParser: true,
        };
      },
    }),

    AuthModule,
    UserModule,
    ProjectModule,
  ],
  controllers: [AppController],
  providers: [
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    { provide: APP_INTERCEPTOR, useClass: TransformResponseInterceptor },
    AppService,
  ],
})
export class AppModule {}
