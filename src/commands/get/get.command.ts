import { Command, CommandRunner, Option } from 'nest-commander';
import { NEW_LINE } from 'src/constants';
import { HeaderService } from 'src/header/header.service';
import { LogService } from 'src/log/log.service';
import { TcpService } from 'src/tcp/tcp.service';

@Command({
  name: 'get',
  arguments: 'URL',
  argsDescription: {
    URL: 'Host location. Example: https://google.com/search?foo=bar',
  },
  description: 'Sends an HTTP 1.1 GET request to the specified url.',
})
export class GetCommand implements CommandRunner {
  private verbose = false;

  constructor(
    private readonly tcpService: TcpService,
    private readonly headerService: HeaderService,
    private readonly logService: LogService,
  ) {}

  async run(args: Array<string>) {
    const [host] = args;
    const url = new URL(host);

    const [responseHeaders, responseBody] = await this.tcpService.get({
      url,
    });

    if (this.verbose) {
      this.logService.log(responseHeaders, NEW_LINE);
    }

    this.logService.log(responseBody);
  }

  @Option({
    flags: '-h, --headers [string]',
    description: `

      Key pair value of a field in headers, separated by a colon. 
      Add multiple to construct the headers map.

      Usage: 
      
        httpc get -h Content-Type:application/json https://www.google.com
    `,
  })
  parseHeaders(header: string) {
    this.headerService.parseHeader(header);
  }

  @Option({
    flags: '-v, --verbose',
    description: `

      Attaches extra data to the response printed out.

      Usage:

        httpc get -v https://www.google.com
    `,
  })
  parseVerboseOption() {
    this.verbose = true;
  }
}
