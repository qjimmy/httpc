import { Module } from '@nestjs/common';
import { TcpModule } from 'src/modules/tcp/tcp.module';
import { LogModule } from 'src/modules/log/log.module';
import { FileService } from './file.service';

@Module({
  imports: [TcpModule, LogModule],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
