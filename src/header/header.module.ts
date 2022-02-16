import { Module } from '@nestjs/common';
import { HeaderService } from './header.service';

@Module({
  providers: [HeaderService, Map],
  exports: [HeaderService],
})
export class HeaderModule {}
