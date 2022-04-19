import { createSocket, RemoteInfo, Socket } from 'dgram';
import { readdirSync, readFileSync, writeFileSync } from 'fs';
import {
  constructMessage,
  PacketType,
  string4BytesToNumber,
} from '../udp/utils';
import { usage } from 'yargs';

const {
  argv: { dir, port, verbose },
} = usage('node main.js [--port port] [--dir directory] [--v verbose]')
  .default<'dir', string>('dir', './')
  .default<'port', number>('port', 8007)
  .default<'verbose', boolean>('verbose', false)
  .help('help');

const basePath = './server/' + dir;

if (verbose) {
  console.log('\x1b[33m%s\x1b[0m', '\n\nVerbose option enabled\n\n', '');
}

class UdpSocket {
  readonly socket: Socket;

  static parseMessage(message: Buffer) {
    const buffer = message.toString();
    const type = buffer.slice(0, 1);
    const sequenceNumber = string4BytesToNumber(buffer.slice(1, 5));
    const address = buffer
      .slice(5, 9)
      .split('')
      .map((char) => char.charCodeAt(0))
      .join('.');
    const payload = buffer.slice(11);

    console.log({
      type,
      sequenceNumber,
      address,
      port,
      payload,
    });

    return {
      type,
      sequenceNumber,
      address,
      port,
      payload,
    };
  }

  constructor(private readonly port: number = 8007) {
    this.socket = createSocket('udp4');
  }

  address() {
    return this.socket.address();
  }

  bind(...args: Partial<[string, () => void]>) {
    this.socket.bind(this.port, ...args);
  }

  close(): void {
    this.socket.close();
  }

  on(
    event: 'close' | 'connect' | 'error' | 'listening' | 'message',
    listener: (...args: any[]) => void,
  ) {
    this.socket.on(event, listener);
  }

  send(msg: string) {
    const message = constructMessage({
      type: PacketType.Data,
      sequenceNumber: 2,
      host: '127.0.0.1',
      port: 3000,
      payload: msg,
    });
    this.socket.send(message, 3000, 'localhost', function (error) {
      if (error) {
        server.close();
      }
      console.log('Server sent: ' + message.toString());
    });
  }
}

const server = new UdpSocket(port);

server.on('listening', function () {
  const { port, family, address } = server.address();
  console.log('\x1b[32m%s', 'Server is listening at port ' + port);
  console.log('Server ip :' + address);
  console.log('Server is IP4/IP6 : ' + family + '\n\n\x1b[0m');
});

server.on('close', function () {
  console.log('Socket is closed !');
});

server.on('message', function (msg: Buffer, info: RemoteInfo) {
  const { payload } = UdpSocket.parseMessage(msg);

  const response = fileServer(payload);

  server.socket.send(
    Buffer.from([...msg.slice(0, 11), ...Buffer.from(response)]),
    info.port,
    'localhost',
    function (error) {
      if (error) {
        server.close();
      }
      console.log('Server sent: ' + payload);
    },
  );
});

server.bind();

function parseHttpRequest(httpRequest: string) {
  // POST /bob HTTP/1.1\nHost: localhost\nContent-Length: 2\n\nHi I created this file\n\n
  const [metaRequest] = httpRequest.toString().split('\n');
  const [method, path, version] = metaRequest.split(' ');
  const [headersString, body] = httpRequest
    .toString()
    .slice(metaRequest.length + 1)
    .split('\n\n');
  const headers = headersString.split('\n').reduce((acc, current) => {
    const [key, value] = current.replace(/ /g, '').split(':');
    const intValue = parseInt(value);
    if (isNaN(intValue)) {
      return { ...acc, [key]: value };
    } else if (value.includes('.')) {
      return { ...acc, [key]: parseFloat(value) };
    } else {
      return { ...acc, [key]: intValue };
    }
  }, {});

  return {
    method,
    path:
      path && path.charAt(path.length - 1) === '/' ? path.slice(0, -1) : path,
    version,
    headers,
    body,
  };
}

function fileServer(request: string): string {
  const { method, path: parsedPath, body } = parseHttpRequest(request);

  const path = parsedPath || '/';

  if ((method === 'GET' || method === 'ET') && path === '/') {
    const listOfFiles = readdirSync(basePath).filter(
      (file) =>
        !(file == 'server.ts' || file === 'client.ts' || file === 'utils.ts'),
    );
    return JSON.stringify(listOfFiles);
  } else if (
    (method === 'GET' || method === 'ET') &&
    path.match(/\/.+/).length > 0
  ) {
    try {
      const numberOfDir = path.split('/').length - 1;
      if (numberOfDir > 1) {
        throw {
          statusCode: 401,
          message: 'Access Denied. You do not have access to that directory.',
        };
      }
      const filePath = basePath + path;
      const fileContent = readFileSync(filePath);
      return fileContent.toString();
    } catch (error) {
      return JSON.stringify({
        statusCode: error?.status || 404,
        message: error?.message || 'No file found for ' + path,
      });
    }
  } else if (
    (method === 'POST' || method === 'OST') &&
    path.match(/\/.+/).length > 0
  ) {
    console.log(path);
    writeFileSync(basePath + path, body, {
      encoding: 'utf8',
      flag: 'w',
    });
    return 'Success!';
  }
}
