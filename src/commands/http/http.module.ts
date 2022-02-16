import { Module } from '@nestjs/common';
import { HeaderModule } from 'src/modules/header/header.module';
import { HttpCommand } from './http.command';

@Module({
  imports: [HeaderModule],
  providers: [HttpCommand],
  exports: [HttpCommand],
})
export class HttpCommandModule {}
