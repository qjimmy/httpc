import { Module } from '@nestjs/common';
import { HeaderModule } from 'src/header/header.module';
import { LogService } from 'src/log/log.service';
import { TcpModule } from 'src/tcp/tcp.module';
import { GetCommand } from './get.command';

@Module({
  imports: [TcpModule, HeaderModule],
  providers: [GetCommand, LogService],
})
export class GetModule {}
