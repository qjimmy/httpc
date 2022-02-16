import { Module } from '@nestjs/common';
import { HeadersDict } from './header.service';

@Module({
  providers: [HeadersDict, Map],
  exports: [HeadersDict],
})
export class HeaderModule {}
