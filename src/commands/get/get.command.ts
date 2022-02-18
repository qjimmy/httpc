import { Command, CommandRunner } from 'nest-commander';
import { NEW_LINE } from 'src/constants';
import { FileService } from 'src/modules/file/file.service';
import { HeadersDict } from 'src/modules/header/header.service';
import { LogService } from 'src/modules/log/log.service';
import { TcpService } from 'src/modules/tcp/tcp.service';
import { HttpCommand } from '../http/http.command';

@Command({
  name: 'get',
  arguments: 'URL',
  argsDescription: {
    URL: 'Host location. Example: https://google.com/search?foo=bar',
  },
  description: 'Sends an HTTP 1.1 GET request to the specified url.',
})
export class GetCommand extends HttpCommand implements CommandRunner {
  constructor(
    private readonly tcpService: TcpService,
    private readonly logService: LogService,
    private readonly fileService: FileService,
    protected readonly headers: HeadersDict,
  ) {
    super(headers);
  }

  async run(args: Array<string>): Promise<void> {
    // Parse URL argument
    const [urlArgument] = args;
    const url = new URL(urlArgument);

    // Send HTTP request using TCP socket
    const [responseHeaders, responseBody] = await this.tcpService.get(url);

    // Print response headers
    if (this.verbose) {
      this.logService.log(responseHeaders, NEW_LINE);
    }

    // Print response body
    this.logService.log(responseBody);

    // Output response to file
    if (this.output) {
      this.fileService.writeFile(this.output, this.verbose);
    }
  }
}
