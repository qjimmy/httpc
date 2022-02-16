import { Test, TestingModule } from '@nestjs/testing';
import { Socket } from 'net';
import { Http, LINE_JUMP, NEW_LINE } from 'src/constants';
import { HeaderModule } from 'src/modules/header/header.module';
import { TcpService } from './tcp.service';

describe('TcpService', () => {
  let service: TcpService;
  let socket: Socket;
  let headers: Map<string, string>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HeaderModule],
      providers: [TcpService, Socket],
      exports: [TcpService],
    }).compile();

    service = module.get<TcpService>(TcpService);
    socket = module.get<Socket>(Socket);
    headers = module.get<Map<string, string>>(Map);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be able to send an HTTP GET request through a TCP socket', async () => {
    const mockPort = 80;
    const mockUrl = new URL('https://www.google.com/');

    jest.spyOn(socket, 'connect');
    jest.spyOn(socket, 'destroy');

    expect(await service.get(mockUrl)).toBeDefined();
    expect(socket.connect).toBeCalledWith(mockPort, mockUrl.host);
    expect(socket.destroy).toBeCalledTimes(1);
  });

  it('should be able to send an HTTP POST request through a TCP socket', async () => {
    const mockPort = 80;
    const mockUrl = new URL('https://www.google.com/');

    jest.spyOn(socket, 'connect');
    jest.spyOn(socket, 'destroy');

    expect(await service.post(mockUrl)).toBeDefined();
    expect(socket.connect).toBeCalledWith(mockPort, mockUrl.host);
    expect(socket.destroy).toBeCalledTimes(1);
  });

  it('should be able to send an HTTP POST request with a body', async () => {
    const mockPort = 80;
    const mockUrl = new URL('https://www.google.com/');
    const mockBody = '{"key": "value"}';

    jest.spyOn(socket, 'connect');
    jest.spyOn(socket, 'destroy');
    jest.spyOn(headers, 'set');

    expect(await service.post(mockUrl, mockBody)).toBeDefined();
    expect(headers.set).toBeCalledWith(
      'Content-Length',
      String(mockBody.length),
    );
    expect(socket.connect).toBeCalledWith(mockPort, mockUrl.host);
    expect(socket.destroy).toBeCalledTimes(1);
  });

  it('should be able to construct a raw HTTP request', () => {
    const mockUrl = new URL('https://www.google.com/search?foo=bar');

    expect(
      service.constructRawRequest({ url: mockUrl, method: Http.GET }),
    ).toEqual(
      `GET /search?foo=bar HTTP/1.1${NEW_LINE}User-Agent: Concordia-HTTP/1.1${LINE_JUMP}${LINE_JUMP}${NEW_LINE}`,
    );
  });

  it('should return the initial response tuple as undefined', () => {
    expect(service.getResponseData()).not.toBeDefined();
  });
});
