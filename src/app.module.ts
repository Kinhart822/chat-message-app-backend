import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './configs/database.module';
import { validate } from './configs/env.validation';
import { InterceptorsModule } from './interceptors/interceptor.module';
import { LoggerHttpRequestMiddleware } from './middleware/logger.middleware';
import { AdminModule } from './modules/admin/admin.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { PipeModule } from './pipes/pipe.module';
import { GuardModule } from './modules/auth/guards/guard.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate,
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'development' ? '.env' : '.env.prod',
      expandVariables: true,
      cache: true,
    }),
    DatabaseModule,
    AuthModule,
    UserModule,
    AdminModule,
    PipeModule,
    InterceptorsModule,
    GuardModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerHttpRequestMiddleware).forRoutes('*');
  }
}
