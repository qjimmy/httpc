import { Test, TestingModule } from '@nestjs/testing';
import { TcpModule } from 'src/modules/tcp/tcp.module';
import { LogModule } from 'src/modules/log/log.module';
import { FileService } from './file.service';

import * as fs from 'fs';
import * as path from 'path';
import { TcpService } from 'src/modules/tcp/tcp.service';
import { LogService } from 'src/modules/log/log.service';

jest.mock('fs');
jest.mock('path');

describe('FileService', () => {
  let service: FileService;
  let tcpService: TcpService;
  let logService: LogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TcpModule, LogModule],
      providers: [FileService],
      exports: [FileService],
    }).compile();

    service = module.get<FileService>(FileService);
    tcpService = module.get<TcpService>(TcpService);
    logService = module.get<LogService>(LogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be able to append to a file', () => {
    const mockPath = '/file.txt';
    const mockResponseTuple = ['headers', 'body'] as [string, string];

    jest.spyOn(path, 'join').mockReturnValue(mockPath);
    jest
      .spyOn(tcpService, 'getResponseData')
      .mockReturnValue(mockResponseTuple);
    jest.spyOn(fs, 'appendFile').mockImplementation(() => {
      logService.log();
    });
    jest.spyOn(logService, 'log');

    expect(service.writeFile(mockPath));
    expect(fs.appendFile).toBeCalled();
    expect(logService.log).toBeCalled();
  });
});
