import { Injectable } from '@nestjs/common';
import { Socket } from 'net';
import { Http, LINE_JUMP, NEW_LINE } from 'src/constants';
import { HeaderService } from 'src/header/header.service';

interface GetArguments {
  url: URL;
  port?: number;
}

interface ConstructRawRequestArguments {
  url: URL;
  method: Http;
  headers?: Map<string, string>;
}

@Injectable()
export class TcpService {
  constructor(
    private readonly socket: Socket,
    private readonly headers: HeaderService,
  ) {}

  /**
   * executes HTTP GET request based on inputs
   *
   * @param {GetArguments} urlObject
   * @param {Boolean} verbose
   *
   * @returns Response body of the GET request
   */
  async get({ url, port = 80 }: GetArguments): Promise<[string, string]> {
    this.socket.connect(port, url.host);
    this.headers.set('Host', url.host);

    this.socket.on('connect', () => {
      const rawHttpRequest = this.constructRawRequest({
        url,
        method: Http.GET,
      });

      this.socket.write(rawHttpRequest);
    });

    return new Promise<[string, string]>((resolve) => {
      this.socket.on('data', (data: Buffer) => {
        this.socket.destroy();

        const response = data.toString().split(LINE_JUMP) as [string, string];

        resolve(response);
      });
    });
  }

  /**
   * Constructs raw HTTP request based on provided data
   *
   * @returns This method returns the raw HTTP string request. Example:
   *
   * GET /query?foo=bar HTTP/1.1
   * Host: httpbin.org
   */
  constructRawRequest({ url, method }: ConstructRawRequestArguments) {
    return `${method} ${url.pathname}?${
      url.searchParams
    } HTTP/1.1${NEW_LINE}${this.headers.asHttpString()}${LINE_JUMP}${LINE_JUMP}`;
  }
}
