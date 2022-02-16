import { Module } from '@nestjs/common';
import { FileModule, HeaderModule, TcpModule } from 'src/modules';
import { LogService } from 'src/modules/log/log.service';
import { PostCommand } from './post.command';

@Module({
  imports: [TcpModule, HeaderModule, FileModule],
  providers: [PostCommand, LogService],
})
export class PostModule {}
