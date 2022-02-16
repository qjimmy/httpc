import { Module } from '@nestjs/common';
import { GetModule, PostModule } from './commands';
import { LogModule } from './modules/log/log.module';

@Module({
  imports: [GetModule, PostModule, LogModule],
})
export class HttpcModule {}
