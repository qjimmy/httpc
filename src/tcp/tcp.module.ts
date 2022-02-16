import { Module } from '@nestjs/common';
import { Socket } from 'net';
import { HeaderModule } from 'src/header/header.module';
import { TcpService } from './tcp.service';

@Module({
  imports: [HeaderModule],
  providers: [TcpService, Socket],
  exports: [TcpService],
})
export class TcpModule {}
