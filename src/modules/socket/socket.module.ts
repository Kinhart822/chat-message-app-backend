import { Module, Global } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { SocketEmitterService } from './socket-emitter.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [JwtModule, ConfigModule],
  providers: [SocketGateway, SocketEmitterService],
  exports: [SocketGateway, SocketEmitterService],
})
export class SocketModule {}
