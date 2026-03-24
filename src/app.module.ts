import { BullModule } from '@nestjs/bullmq';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisCacheModule } from './configs/cache.module';
import { DatabaseModule } from './configs/database.module';
import { validate } from './configs/env.validation';
import { InterceptorsModule } from './interceptors/interceptor.module';
import { LoggerHttpRequestMiddleware } from './middleware/logger.middleware';
import { AdminModule } from './modules/admin/admin.module';
import { AuditLogModule } from './modules/audit-log/audit-log.module';
import { AuthModule } from './modules/auth/auth.module';
import { GuardModule } from './modules/auth/guards/guard.module';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
import { ConversationModule } from './modules/conversation/conversation.module';
import { FriendshipModule } from './modules/friendship/friendship.module';
import { MessageModule } from './modules/message/message.module';
import { SocketModule } from './modules/socket/socket.module';
import { SystemConfigModule } from './modules/system-config/system-config.module';
import { UserModule } from './modules/user/user.module';
import { PipeModule } from './pipes/pipe.module';

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
    GuardModule,
    RedisCacheModule,
    SocketModule,
    AuditLogModule,
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
          password: configService.get<string>('REDIS_PASSWORD'),
        },
      }),
    }),
    ConversationModule,
    MessageModule,
    CloudinaryModule,
    FriendshipModule,
    SystemConfigModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerHttpRequestMiddleware).forRoutes('*');
  }
}
