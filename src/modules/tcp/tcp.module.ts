import { Module } from '@nestjs/common';
import { HeaderModule } from 'src/modules/header/header.module';
import { TcpService } from './tcp.service';

@Module({
  imports: [HeaderModule],
  providers: [TcpService],
  exports: [TcpService],
})
export class TcpModule {}
