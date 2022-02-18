import { Injectable } from '@nestjs/common';

import * as fs from 'fs';
import * as path from 'path';

import { LINE_JUMP } from 'src/constants';
import { LogService } from 'src/modules/log/log.service';
import { TcpService } from 'src/modules/tcp/tcp.service';

@Injectable()
export class FileService {
  private readonly callerDirectory = process.env.INIT_CWD;

  constructor(
    private readonly tcpService: TcpService,
    private readonly logger: LogService,
  ) {}

  writeFile(filePath: string, verbose = false): void {
    const outputPath = path.join(this.callerDirectory, filePath);
    const [responseHeaders, responseBody] = this.tcpService.getResponseData();

    fs.appendFileSync(
      outputPath,
      verbose ? responseHeaders.concat(LINE_JUMP, responseBody) : responseBody,
    );
    this.logger.log(`${LINE_JUMP} File written to ${outputPath}`);
  }

  readFileContents(filePath: string): string {
    const absolutePath = path.join(this.callerDirectory, filePath);
    return fs.readFileSync(absolutePath, 'utf-8');
  }
}
