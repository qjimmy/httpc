import { Command, CommandRunner, Option } from 'nest-commander';
import { NEW_LINE } from 'src/constants';
import { FileService } from 'src/modules/file/file.service';
import { HeadersDict } from 'src/modules/header/header.service';
import { LogService } from 'src/modules/log/log.service';
import { TcpService } from 'src/modules/tcp/tcp.service';
import { HttpCommand } from '../http/http.command';

@Command({
  name: 'post',
  arguments: 'URL',
  argsDescription: {
    URL: 'Host location. Example: https://google.com/search?foo=bar',
  },
  description: 'Sends an HTTP 1.1 POST request to the specified url.',
})
export class PostCommand extends HttpCommand implements CommandRunner {
  private body: string;
  private file: string;

  constructor(
    private readonly tcpService: TcpService,
    private readonly logService: LogService,
    private readonly fileService: FileService,
    protected readonly headers: HeadersDict,
  ) {
    super(headers);
  }

  async run(args: Array<string>): Promise<void> {
    // Prevent having both -d and -f options used together
    if (this.body && this.file) {
      // TODO: throw exception with custom message
    }

    // Parse URL argument
    const [urlArgument] = args;
    const url = new URL(urlArgument);

    // Send HTTP request using TCP socket
    const [responseHeaders, responseBody] = await this.tcpService.post(
      url,
      this.body,
    );

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

  @Option({
    flags: '-f, --file [string]',
    description: `

      Attaches a file to the request body.

      Usage:

        httpc post http://httpbin.org/post -f file
    `,
  })
  parseFileOption(value: string) {
    this.file = value;
  }

  @Option({
    flags: '-d, --data [string]',
    description: `

      Attaches data to the request body.

      Usage:

        httpc post http://httpbin.org/post -d '{"key": value}'
    `,
  })
  parseDataOption(value: string) {
    this.body = value;
  }
}
