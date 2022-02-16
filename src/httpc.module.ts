import { Module } from '@nestjs/common';
import { GetModule } from './commands';
import { LogModule } from './log/log.module';

@Module({
  imports: [GetModule, LogModule],
})
export class HttpcModule {}
