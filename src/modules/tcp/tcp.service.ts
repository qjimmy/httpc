import { Injectable } from '@nestjs/common';
import { Socket } from 'net';
import { Http, LINE_JUMP, NEW_LINE, PORT } from 'src/constants';
import { HeadersDict } from 'src/modules/header/header.service';

interface ConstructRawRequestArguments {
  url: URL;
  method: Http;
  body?: string;
}

@Injectable()
export class TcpService {
  private response: [string, string];

  constructor(
    private readonly socket: Socket,
    private readonly headers: HeadersDict,
  ) {}

  /**
   * executes HTTP GET request based on url provided
   *
   * @param {URL} url
   *
   * @returns {[string, string]} Headers and body of the response from the GET request
   */
  async get(url: URL): Promise<[string, string]> {
    this.socket.connect(PORT, url.host);
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
        this.response = response;

        resolve(response);
      });
    });
  }

  /**
   * executes HTTP POST request based on provided data
   *
   * @param {URL} url
   * @param {body} string
   *
   * @returns {[string, string]} Headers and body of the response from the POST request
   */
  async post(url: URL, body?: string): Promise<[string, string]> {
    this.socket.connect(PORT, url.host);
    this.headers.set('Host', url.host);

    if (body) {
      this.headers.set('Content-Length', String(body.length));
    }

    this.socket.on('connect', () => {
      const rawHttpRequest = this.constructRawRequest({
        url,
        method: Http.POST,
        body,
      });

      this.socket.write(rawHttpRequest);
    });

    return new Promise<[string, string]>((resolve) => {
      this.socket.on('data', (data: Buffer) => {
        this.socket.destroy();

        const response = data.toString().split(LINE_JUMP) as [string, string];
        this.response = response;

        resolve(response);
      });
    });
  }

  /**
   * Constructs raw HTTP request based on provided data
   *
   * @param {ConstructRawRequestArguments} httpParams
   * @returns {string} This method returns the raw HTTP string request. Example:
   *
   * GET /query?foo=bar HTTP/1.1
   * Host: httpbin.org
   */
  constructRawRequest({
    url,
    method,
    body,
  }: ConstructRawRequestArguments): string {
    return `${method} ${url.pathname}?${
      url.searchParams
    } HTTP/1.1${NEW_LINE}${this.headers.asHttpString()}${body ? NEW_LINE : ''}${
      body ?? ''
    }${LINE_JUMP}${LINE_JUMP}`;
  }

  getResponseData(): [string, string] {
    return this.response;
  }
}
