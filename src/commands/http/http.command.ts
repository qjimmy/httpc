import { Option } from 'nest-commander';
import { HeadersDict } from 'src/modules/header/header.service';

export class HttpCommand {
  protected verbose = false;
  protected output: string;

  constructor(protected readonly headers: HeadersDict) {}

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
    this.headers.parseHeader(header);
  }

  @Option({
    flags: '-v, --verbose',
    description: `

      Attaches response headers data to the printed output.

      Usage:

        httpc get -v https://www.google.com
    `,
  })
  parseVerboseOption() {
    this.verbose = true;
  }

  @Option({
    flags: '-o, --output [string]',
    description: `

      Writes the HTTP response to a file in a specified directory. Creates a new file
      if file does not exists. Else, response is appended to file.

      Usage:

        httpc get -v https://www.google.com -o ../myDocuments/myFile.txt
    `,
  })
  parseOutputOption(output: string) {
    this.output = output;
  }
}
