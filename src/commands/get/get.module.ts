import { Module } from '@nestjs/common';
import { FileModule, HeaderModule, TcpModule } from 'src/modules';
import { LogService } from 'src/modules/log/log.service';
import { GetCommand } from './get.command';

@Module({
  imports: [TcpModule, HeaderModule, FileModule],
  providers: [GetCommand, LogService],
})
export class GetModule {}
