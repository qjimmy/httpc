import { Test, TestingModule } from '@nestjs/testing';
import { NEW_LINE } from 'src/constants';
import { HeaderService } from './header.service';

const mockHeaders: Record<string, string> = {
  Accept: '*/*',
  'Content-Type': 'application/json',
};

describe('HeaderService', () => {
  let service: HeaderService;
  let headers: Map<string, string>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HeaderService, Map],
      exports: [HeaderService],
    }).compile();

    service = module.get<HeaderService>(HeaderService);
    headers = module.get<Map<string, string>>(Map);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be able to parse the headers options', () => {
    const mockKey = 'mock-key';
    const mockValue = 'mock-value';
    const mockHeaderOption = `${mockKey}:${mockValue}`;

    jest.spyOn(headers, 'set');

    expect(service.parseHeader(mockHeaderOption)).toEqual([mockKey, mockValue]);
    expect(headers.set).toBeCalledWith(mockKey, mockValue);
    expect(headers.set).toBeCalledTimes(1);
  });

  it('should throw an error on missing colon', () => {
    const mockHeaderOption = `mock`;

    jest.spyOn(headers, 'set');

    try {
      expect(service.parseHeader(mockHeaderOption)).toThrowError();
    } catch (error) {}
    expect(headers.set).not.toBeCalled();
  });

  it('should be able to return headers formatted for raw HTTP requests', () => {
    Object.entries(mockHeaders).forEach(([key, value]) => {
      headers.set(key, value);
    });

    const rawHttpHeaders = `User-Agent: Concordia-HTTP/1.1${NEW_LINE}Accept: */*${NEW_LINE}Content-Type: application/json${NEW_LINE}`;

    expect(service.asHttpString()).toEqual(rawHttpHeaders);
  });

  it('should be able to return http headers in JSON format', () => {
    const mockResult = {};

    Object.entries(Object.fromEntries(headers)).forEach(([key, value]) => {
      mockResult[key] = value;
    });

    expect(service.toJSON()).toEqual(mockResult);
  });

  it('should be able to get a value based on a provided key', () => {
    const mockKey = 'User-Agent';

    jest.spyOn(headers, 'get');

    expect(service.get(mockKey)).toBeDefined();
    expect(headers.get).toBeCalledWith(mockKey);
    expect(headers.get).toBeCalledTimes(1);
  });

  it('should be able to set a key pair value into the headers', () => {
    const mockKey = 'mock-key';
    const mockValue = 'mock-value';

    jest.spyOn(headers, 'set');

    expect(service.set(mockKey, mockValue)).toBeUndefined();
    expect(headers.set).toBeCalledWith(mockKey, mockValue);
    expect(headers.set).toBeCalledTimes(1);
  });
});
