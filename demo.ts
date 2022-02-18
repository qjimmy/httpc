import { TcpService } from 'src/modules/tcp/tcp.service';
import { HeadersDict } from 'src/modules/header/header.service';

/**
 * Demo for the HTTP library
 */

const headers = new Map<string, string>();
const requestBody = 'Hello World!';
const jsonRequestBody = JSON.stringify({
  Hello: 'World!',
});

const header = new HeadersDict(headers);
const tcp = new TcpService(header);

const GET_REQUEST_ENDPOINT = new URL('https://httpbin.org/get');
const POST_REQUEST_ENDPOINT = new URL('https://httpbin.org/post');

(async function main() {
  /**
   * Regular GET request;
   */
  const [, body1] = await tcp.get(GET_REQUEST_ENDPOINT);
  console.log(body1);

  /**
   * POST request with text data
   */
  const [, body2] = await tcp.post(POST_REQUEST_ENDPOINT, requestBody);
  console.log(body2);

  /**
   * POST request with JSON data and Content-Type header
   */
  header.set('Content-Type', 'application/json');
  const [, body3] = await tcp.post(POST_REQUEST_ENDPOINT, jsonRequestBody);
  console.log(body3);
})();
